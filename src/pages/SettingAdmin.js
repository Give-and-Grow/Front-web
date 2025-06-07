import React, { useState } from "react";
import axios from "axios";
import {
  FaUserShield,
  FaEnvelope,
  FaKey,
  FaCheck,
  FaSync,
  FaSignInAlt,
} from "react-icons/fa";
import "./SettingAdmin.css"; // استدعاء ملف CSS
import Sidebar from './Sidebar'; // تأكد من المسار حسب مشروعك
import Navbar from '../pages/Navbar';
const API_BASE = "http://localhost:5000";

const SettingAdmin = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    role: "admin",
    role_level: "admin",
    code: "",
  });

  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const createAdmin = async () => {
    try {
      const res = await axios.post(`${API_BASE}/admin/create-admin`, {
        email: form.email,
        password: form.password,
        role: form.role,
        name: form.name,
        role_level: form.role_level,
      });
      showMessage(res.data.msg);
    } catch (err) {
      showMessage(err.response?.data?.msg || "Error");
    }
  };

  const verifyEmail = async () => {
    try {
      const res = await axios.post(`${API_BASE}/verify`, {
        email: form.email,
        code: form.code,
      });
      showMessage(res.data.msg);
    } catch (err) {
      showMessage(err.response?.data?.msg || "Error");
    }
  };

  const resendCode = async () => {
    try {
      const res = await axios.post(`${API_BASE}/resend-code`, {
        email: form.email,
      });
      showMessage(res.data.msg);
    } catch (err) {
      showMessage(err.response?.data?.msg || "Error");
    }
  };

  const login = async () => {
    try {
      const res = await axios.post(`${API_BASE}/login`, {
        username: form.email,
        password: form.password,
      });
      localStorage.setItem("adminToken", res.data.token);
      setToken(res.data.token);
      showMessage("Login successful");
    } catch (err) {
      showMessage(err.response?.data?.msg || "Error");
    }
  };

  const resetPassword = async () => {
    try {
      const res = await axios.post(`${API_BASE}/reset-password-request`, {
        email: form.email,
      });
      showMessage(res.data.msg);
    } catch (err) {
      showMessage(err.response?.data?.msg || "Error");
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar />
    <div className="admin-container">
      <div className="admin-card">
        <h1 className="admin-title">🛠️ Admin Settings</h1>

        {message && <div className="admin-message">{message}</div>}

        <div className="admin-form">
          <label>Email:</label>
          <input
            name="email"
            onChange={handleChange}
            value={form.email}
            className="admin-input"
          />

          <label>Password:</label>
          <input
            name="password"
            onChange={handleChange}
            type="password"
            value={form.password}
            className="admin-input"
          />

          <label>Name:</label>
          <input
            name="name"
            onChange={handleChange}
            value={form.name}
            className="admin-input"
          />

          <label>Code (for verification):</label>
          <input
            name="code"
            onChange={handleChange}
            value={form.code}
            className="admin-input"
          />
        </div>

        <div className="admin-buttons">
          <button onClick={createAdmin} className="admin-btn green">
            <FaUserShield /> Create Admin
          </button>
          <button onClick={verifyEmail} className="admin-btn teal">
            <FaCheck /> Verify Email
          </button>
          <button onClick={resendCode} className="admin-btn light">
            <FaSync /> Resend Code
          </button>
          <button onClick={resetPassword} className="admin-btn dark">
                  <FaKey /> Reset Password
          </button>
      
        </div>

        {token && (
          <div className="admin-token">
            <strong>Saved Token:</strong>
            <p>{token}</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default SettingAdmin;
