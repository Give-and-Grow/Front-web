import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Sidebar from './Sidebar';
import Navbar from '../pages/Navbar';
import Toast from '../components/Toast'; // Adjust path if Toast.js is elsewhere
import './IdentityVerificationPage.css';

const API_BASE = 'http://localhost:5000';

export default function IdentityVerificationPage() {
  const [users, setUsers] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' }); // Toast state

  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type });
  };

  const closeToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [userRes, orgRes] = await Promise.all([
        axios.get(`${API_BASE}/admin/users/identity`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE}/admin/organizations/proof`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setUsers(userRes.data);
      setOrgs(orgRes.data);
    } catch (error) {
      showToast('Failed to load data', 'error');
    }
  };

  const updateStatus = async (id, type, status) => {
    const token = localStorage.getItem('token');
    const url =
      type === 'user'
        ? `${API_BASE}/admin/users/identity/${id}/verification`
        : `${API_BASE}/admin/organizations/proof/${id}/status`;

    try {
      await axios.put(
        url,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast(`Status updated to ${status}`, 'success');
      fetchData();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update status';
      showToast(message, 'error');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statusClass = (status) => {
    if (!status) return '';
    return `status ${status.toLowerCase()}`;
  };

  return (
    <>
      <Sidebar />
      <Navbar />
      <div className="verification-container">
        {/* Filter section */}
        <div className="filter-wrapper">
          <div className="filter-options">
            <button
              className={`filter-option ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-option ${filter === 'users' ? 'active' : ''}`}
              onClick={() => setFilter('users')}
            >
              Users
            </button>
            <button
              className={`filter-option ${filter === 'orgs' ? 'active' : ''}`}
              onClick={() => setFilter('orgs')}
            >
              Organizations
            </button>
          </div>
        </div>

        {/* Users verification */}
        {(filter === 'all' || filter === 'users') && (
          <>
            <h2>User Identity Verification</h2>
            {users.length === 0 && <p className="no-data">No users data available.</p>}
            {users.map((user) => (
              <div className="card" key={user.id}>
                <h3>{user.full_name}</h3>
                <p><strong>City:</strong> {user.city || 'Not specified'}</p>
                <p><strong>Gender:</strong> {user.gender}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={statusClass(user.verification_status)}>
                    {user.verification_status}
                  </span>
                </p>
                {user.identity_picture ? (
                  <img src={user.identity_picture} alt="User ID" />
                ) : (
                  <p className="no-image">No ID image</p>
                )}
                <div className="btn-group">
                  <button
                    className="approve"
                    onClick={() => updateStatus(user.id, 'user', 'approved')}
                  >
                    <FaCheckCircle style={{ marginRight: 6 }} /> Approve
                  </button>
                  <button
                    className="reject"
                    onClick={() => updateStatus(user.id, 'user', 'rejected')}
                  >
                    <FaTimesCircle style={{ marginRight: 6 }} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Organizations verification */}
        {(filter === 'all' || filter === 'orgs') && (
          <>
            <h2>Organization Proof Verification</h2>
            {orgs.length === 0 && <p className="no-data">No organizations data available.</p>}
            {orgs.map((org) => (
              <div className="card" key={org.id}>
                <h3>{org.name}</h3>
                <p><strong>Address:</strong> {org.address}</p>
                <p><strong>Phone:</strong> {org.phone}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={statusClass(org.verification_status)}>
                    {org.verification_status}
                  </span>
                </p>
                {org.proof_image ? (
                  <img src={org.proof_image} alt="Organization Proof" />
                ) : (
                  <p className="no-image">No proof image</p>
                )}
                <div className="btn-group">
                  <button
                    className="approve"
                    onClick={() => updateStatus(org.id, 'org', 'approved')}
                  >
                    <FaCheckCircle style={{ marginRight: 6 }} /> Approve
                  </button>
                  <button
                    className="reject"
                    onClick={() => updateStatus(org.id, 'org', 'rejected')}
                  >
                    <FaTimesCircle style={{ marginRight: 6 }} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={closeToast}
        />
      </div>
    </>
  );
}