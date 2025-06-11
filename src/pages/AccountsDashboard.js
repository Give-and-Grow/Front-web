import React, { useEffect, useState } from "react";
import './AccountsDashboard.css';
import axios from "axios";
import {
  MdEmail,
  MdPerson,
  MdVerifiedUser,
  MdCalendarToday,
  MdCheckCircle,
  MdAssignmentInd,
  MdSearch,
  MdBarChart,
  MdPeople,
  MdPersonOutline,
  MdGroup,
  MdTrendingUp
} from "react-icons/md";
import Sidebar from './Sidebar';
import Navbar from '../pages/Navbar';
import Toast from '../components/Toast'; // Adjust path if needed

const roles = ["", "admin", "user", "organization"];

const iconMap = {
  total_accounts: <MdPeople size={30} color="#047857" />,
  active_accounts: <MdCheckCircle size={30} color="#059669" />,
  inactive_accounts: <MdPersonOutline size={30} color="#34d399" />,
  admin_accounts: <MdAssignmentInd size={30} color="#065f46" />,
  new_accounts: <MdTrendingUp size={30} color="#10b981" />,
};

export default function AccountsDashboard() {
  const [accounts, setAccounts] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' }); // Toast state
  const token = localStorage.getItem("usertoken");

  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type });
  };

  const closeToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  const fetchAccounts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/accounts/", {
        params: { search, role, is_active: isActive, page },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAccounts(res.data.accounts);
      setPages(res.data.pages);
    } catch (error) {
      console.error("Failed to fetch accounts", error);
      showToast("Failed to fetch accounts", "error");
    }
  };

  const verifyOrganization = async (orgId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/admin/organizations/proof/${orgId}/status`,
        { status: "approved" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showToast("Organization verification status updated successfully", "success");
      fetchAccounts();
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      if (error.response) {
        console.error("Verification failed with response:", error.response.data);
        showToast(`Failed to verify organization: ${message}`, "error");
      } else if (error.request) {
        console.error("No response received:", error.request);
        showToast("No response from server. Please check your connection.", "error");
      } else {
        console.error("Error during request setup:", error.message);
        showToast(`Failed to verify organization: ${message}`, "error");
      }
    }
  };

  const verifyUser = async (userId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/admin/users/identity/${userId}/verification`,
        { status: "approved" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response from verifyUser:", response);
      showToast("Verification status updated successfully", "success");
      fetchAccounts();
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      if (error.response) {
        console.error("Verification failed with response:", error.response.data);
        showToast(`Failed to verify user: ${message}`, "error");
      } else if (error.request) {
        console.error("No response received:", error.request);
        showToast("No response from server. Please check your connection.", "error");
      } else {
        console.error("Error during request setup:", error.message);
        showToast(`Failed to verify user: ${message}`, "error");
      }
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/accounts/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(res.data);
    } catch (error) {
      console.error("Failed to fetch stats", error);
      showToast("Failed to fetch stats", "error");
    }
  };

  useEffect(() => {
    fetchAccounts();
    fetchStats();
  }, [search, role, isActive, page]);

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="dashboard-container">
        <h1 className="dashboard-title">User Accounts</h1>

        {/* Filters مع أيقونة البحث */}
        <div className="filters-container">
          <div className="search-input-wrapper">
            <MdSearch size={24} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field search-input"
            />
          </div>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="select-field"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r || "All Roles"}
              </option>
            ))}
          </select>
          <select
            value={isActive}
            onChange={(e) => setIsActive(e.target.value)}
            className="select-field"
          >
            <option value="">All Statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* إحصائيات مع أيقونات */}
        <div className="stats-grid">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="stats-card">
              <div className="stats-icon">{iconMap[key] || <MdBarChart size={30} color="#047857" />}</div>
              <p className="stats-key">{key.replace(/_/g, " ")}</p>
              <p className="stats-value">{value}</p>
            </div>
          ))}
        </div>

        {/* جدول الحسابات */}
        <div className="table-wrapper">
          <table className="accounts-table">
            <thead>
              <tr>
                <th>
                  <MdEmail size={20} /> Email
                </th>
                <th>
                  <MdPerson size={20} /> Username
                </th>
                <th>
                  <MdAssignmentInd size={20} /> Role
                </th>
                <th>
                  <MdCheckCircle size={20} /> Active?
                </th>
                <th>
                  <MdVerifiedUser size={20} /> Email Verified?
                </th>
                <th>
                  <MdCalendarToday size={20} /> Created At
                </th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc) => (
                <tr key={acc.id}>
                  <td>{acc.email}</td>
                  <td>{acc.username}</td>
                  <td>{acc.role}</td>
                  <td>{acc.is_active ? "Yes" : "No"}</td>
                  <td>
                    {acc.is_email_verified ? (
                      "Yes"
                    ) : acc.role === "user" ? (
                      <button onClick={() => verifyUser(acc.id)} className="verify-btn">
                        Verify User
                      </button>
                    ) : acc.role === "organization" ? (
                      <button onClick={() => verifyOrganization(acc.id)} className="verify-btn">
                        Verify Org
                      </button>
                    ) : (
                      "No"
                    )}
                  </td>
                  <td>{new Date(acc.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* الصفحات */}
        <div className="pagination">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            ⬅ Previous
          </button>
          <span>
            Page {page} of {pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, pages))}
            disabled={page === pages}
          >
            Next ➡
          </button>
        </div>
      </div>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />
    </>
  );
}