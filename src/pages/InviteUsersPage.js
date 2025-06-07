import React, { useEffect, useState } from "react";
import axios from "axios";
import "./InviteUsersPage.css";
import { FaUserPlus } from "react-icons/fa";
import Sidebar from './Sidebar'; // تأكد من المسار حسب مشروعك
import Navbar from '../pages/Navbar';
const API_URL = "http://localhost:5000";

const InviteUsersPage = ({ opportunityId = 1 }) => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/invite/opportunity/${opportunityId}`);
      setUsers(response.data);
    } catch (error) {
      setMessage("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const sendInvite = async (userId) => {
    try {
      const response = await axios.post(`${API_URL}/invite/send`, {
        user_id: userId,
        opportunity_id: opportunityId,
      });
      setMessage(response.data.msg || "Invitation sent successfully.");
    } catch (error) {
      setMessage(error.response?.data?.msg || "Error sending invitation.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [opportunityId]);

  return (
    <>
          <Navbar />
          <Sidebar />
    <div className="invite-container">
      <h2 className="invite-title">📨 Invite Users to Volunteer Opportunity</h2>
      {message && <div className="invite-message">{message}</div>}

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <div className="user-list">
          {users.length === 0 ? (
            <p>No users available for invitation.</p>
          ) : (
            users.map((user) => (
              <div key={user.id} className="user-card">
                <div className="user-info">
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
                </div>
                <button className="invite-button" onClick={() => sendInvite(user.id)}>
                  <FaUserPlus size={18} /> Invite
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
      </>
  );
};

export default InviteUsersPage;
