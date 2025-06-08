import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUserPlus,
  FaUser,
  FaGlobe,
  FaCity,
  FaStar,
  FaEnvelopeOpenText,
  FaSearch
} from "react-icons/fa";

import { useLocation, useNavigate } from "react-router-dom";
import "./InviteUsersPage.css";
import Navbar from "../pages/Navbar";

const API_URL = "http://localhost:5000";

const InviteUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [invitedIds, setInvitedIds] = useState([]);
  const [hoveredUserId, setHoveredUserId] = useState(null);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
const [searchTerm, setSearchTerm] = useState("");

const filteredUsers = users.filter((user) =>
  `${user.first_name} ${user.last_name}`
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
);

  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // قراءة opportunityId من query param
  const queryParams = new URLSearchParams(location.search);
  const opportunityId = queryParams.get("opportunityId");

  const fetchUsers = async () => {
    if (!opportunityId) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/invite/opportunity/${opportunityId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const fetchedUsers = response.data.invited_users || [];
      setUsers(fetchedUsers);

      // الحالة الافتراضية: كل اليوزرات محددين (selected = true)
      const allUserIds = fetchedUsers.map((user) => user.id);
      setSelectedUserIds(allUserIds);
    } catch (error) {
      setMessage("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectUser = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const sendInvitesToSelected = async () => {
    if (selectedUserIds.length === 0) {
      setMessage("Please select at least one user.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/invite/opportunity/${opportunityId}`,
        { user_ids: selectedUserIds },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(response.data.msg || "Invitations sent successfully.");
      setInvitedIds((prev) => [...prev, ...selectedUserIds]);
      setSelectedUserIds([]); // نفضي الاختيارات بعد الإرسال
        setTimeout(() => {
    navigate("/homepage"); // استبدل "/home" بالمسار الصحيح للصفحة الرئيسية في مشروعك
  }, 1000);

    } catch (error) {
      setMessage(
        error.response?.data?.msg || "Error sending invitations."
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [opportunityId]);

  if (!opportunityId) {
    return (
      <>
        <Navbar />
        <div className="invite-container">
          <h2>Please select an opportunity first.</h2>
          <button onClick={() => navigate("/homepage")}>Go Back Home</button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="invite-container">
        <h2 className="invite-title">
          <span className="animate-icon-text">
            <FaEnvelopeOpenText
              style={{ color: "#43a047", marginRight: "8px" }}
            />
            Invite Users
          </span>
        </h2>

        {message && <div className="invite-message">{message}</div>}
<div className="search-container">
  <input
    type="text"
    placeholder="Search users..."
    className="search-box"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <FaSearch className="search-icon-inside" />
</div>


        {loading ? (
          <div className="loading">Loading users...</div>
        ) : (
          <>
           <div className="user-list scrollable-user-list">

              {users.length === 0 ? (
                <p>No users available to invite.</p>
              ) : (
                filteredUsers.map((user) => (
                  <div key={user.id} className="user-card">
                    <div className="user-info">
                      <img
                        src={user.profile_picture}
                        alt="Profile"
                        className="profile-img"
                      />
                      <div>
                        <p
                          className="user-name"
                          onMouseEnter={() => setHoveredUserId(user.id)}
                          onMouseLeave={() => setHoveredUserId(null)}
                          style={{
                            position: "relative",
                            cursor: "pointer",
                            lineHeight: "1.6",
                          }}
                        >
                       <div className="user-info-text" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
  <div><FaUser /> {user.first_name} {user.last_name}</div>
  <div><FaCity /> {user.city}</div>
  <div><FaGlobe /> {user.country}</div>
</div>


                          {hoveredUserId === user.id && (
                            <div className="tooltip">
                              <p>
                                <FaStar /> Total Points: {user.total_points}
                              </p>
                            </div>
                          )}
                        </p>
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => toggleSelectUser(user.id)}
                      disabled={invitedIds.includes(user.id)}
                      title={
                        invitedIds.includes(user.id)
                          ? "Already invited"
                          : "Select user"
                      }
                      style={{
                        transform: "scale(1.4)",
                        cursor: invitedIds.includes(user.id)
                          ? "not-allowed"
                          : "pointer",
                      }}
                    />
                  </div>
                ))
              )}
            </div>

            <button
              className="invite-button"
              onClick={sendInvitesToSelected}
              disabled={selectedUserIds.length === 0}
              style={{ marginTop: "20px" }}
            >
              <FaUserPlus /> Invite  Users
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default InviteUsersPage;
