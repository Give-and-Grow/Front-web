import React from 'react';
import Sidebar from './Sidebar'; // تأكد من المسار حسب مشروعك
import './AdminDashboard.css';
import Navbar from '../pages/Navbar';  // عدل المسار حسب مكان ملف Navbar.js
export default function AdminDashboard() {
  return (

    <div className="dashboard-layout">
         <Navbar />
      <Sidebar />
      <main className="main-content">
        <h1 className="header-text">Welcome, Admin 👋</h1>
        <div className="card-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>125</p>
          </div>
          <div className="stat-card">
            <h3>Volunteer Opportunities</h3>
            <p>38</p>
          </div>
          <div className="stat-card">
            <h3>Skills</h3>
            <p>45</p>
          </div>
          <div className="stat-card">
            <h3>Industries</h3>
            <p>22</p>
          </div>
        </div>
      </main>
    </div>
  );
}
