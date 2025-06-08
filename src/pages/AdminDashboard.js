import React, { useEffect, useState } from "react";
import { Pie, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaUserShield,
  FaBuilding,
  FaSyncAlt,
  FaUserClock,
  FaVenusMars,
  FaCity,
} from "react-icons/fa";
import "./AdminDashboard.css";
import Sidebar from './Sidebar';
import Navbar from '../pages/Navbar';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AdminsDashboard = () => {
  const [stats, setStats] = useState({
    roles: [],
    total_admins: 0,
    active_admins: 0,
    inactive_admins: 0,
  });

  const [orgStats, setOrgStats] = useState({
    active_organizations: 0,
    inactive_organizations: 0,
    total_organizations: 0,
    verified_organizations: 0,
  });

  const [userStats, setUserStats] = useState({
    pending_users: 0,
    total_users: 0,
    users_by_city: [],
    users_by_gender: [],
  });

  const [orgChartType, setOrgChartType] = useState("doughnut");
  const token = localStorage.getItem("userToken");

const greenShades  = ["#f94144", "#f9c74f", "#43aa8b", "#577590", "#9b5de5"];


  const fetchWithToken = (url) => {
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  useEffect(() => {
    if (!token) return;

    fetchWithToken("http://localhost:5000/admin/admins/stats")
      .then((res) => res.json())
      .then(setStats);

    fetchWithToken("http://localhost:5000/admin/organizations/stats")
      .then((res) => res.json())
      .then(setOrgStats);

    fetchWithToken("http://localhost:5000/admin/users/stats")
      .then((res) => res.json())
      .then(setUserStats);
  }, [token]);

  if (!token) {
    return (
      <div className="container">
        <h2>Please login to access the admin dashboard.</h2>
      </div>
    );
  }

  const statusData = {
    labels: ["Active", "Inactive"],
    datasets: [
      {
        label: "Admins Status",
        data: [stats.active_admins, stats.inactive_admins],
         backgroundColor: ["#43aa8b", "#f94144"], // أخضر وأحمر
        borderWidth: 1,
      },
    ],
  };

  const rolesData = {
    labels: stats.roles.map((role) => role.role),
    datasets: [
      {
        label: "Admins per Role",
        data: stats.roles.map((role) => role.count),
        backgroundColor: stats.roles.map((_, idx) => greenShades[idx % greenShades.length]),
        borderWidth: 1,
      },
    ],
  };

  const orgStatusData = {
    labels: ["Active Organizations", "Inactive Organizations"],
    datasets: [
      {
        label: "Organizations Status",
        data: [orgStats.active_organizations, orgStats.inactive_organizations],
        backgroundColor: ["#f9c74f", "#577590"], // أصفر وأزرق
        borderWidth: 1,
      },
    ],
  };
const genderData = {
  labels: userStats.users_by_gender.map((g) => g.gender),
  datasets: [
    {
      label: "Users by Gender",
      data: userStats.users_by_gender.map((g) => g.count),
      backgroundColor: userStats.users_by_gender.map((_, i) => greenShades[i % greenShades.length]),
      borderWidth: 1,
    },
  ],
};

const pendingData = {
  labels: ['Pending Users'],
  datasets: [{
    label: 'Pending',
    data: [userStats.pending_users],
       backgroundColor: ["#9b5de5"], // بنفسجي
    borderRadius: 5
  }]
};
  const cityData = {
    labels: userStats.users_by_city.map((c) => c.city || "Unknown"),
    datasets: [
      {
        label: "Users by City",
        data: userStats.users_by_city.map((c) => c.count),
        backgroundColor: "#3c8d4a",
      },
    ],
  };

  const toggleOrgChartType = () => {
    setOrgChartType((prev) => (prev === "doughnut" ? "pie" : "doughnut"));
  };

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="container">
        <h1 style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <FaUserShield style={{ marginRight: "10px", color: "#2a7a39" }} />
          Admin Dashboard
        </h1>
{/* Users by City */}
           <Bar
  data={cityData}
  options={{
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxRotation: 45, // يجعل النص مائل
          minRotation: 30, // أقل دوران مسموح
          font: {
            size: 10, // تصغير الخط قليلاً
          },
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  }}
/>
        <div className="stats">
          <h2 style={{ display: "flex", alignItems: "center" }}>
            <FaUsers style={{ marginRight: "8px", color: "#246c2d" }} />
            Statistics Overview
          </h2>

          <div className="charts-container">
            {/* Admins Status */}
            <div className="chart-box">
              <h3><FaUserCheck style={{ color: "#3ca55c", marginRight: "6px" }} /> Admins Status</h3>
              <Pie data={statusData} />
            </div>

            {/* Admins by Role */}
            <div className="chart-box">
              <h3 style={{ color: "#3c8d4a" }}>Admins by Role</h3>
              <Bar
                data={rolesData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true, stepSize: 1 } },
                }}
              />
            </div>
  


            {/* Organizations Status */}
            <div className="chart-box">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ display: "flex", alignItems: "center", color: "#3c8d4a" }}>
                  <FaBuilding style={{ marginRight: "6px", color: "#3ca55c" }} /> Organizations Status
                </h3>
                <button
                  onClick={toggleOrgChartType}
                  style={{ padding: "5px 10px", background: "#3ca55c", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
                >
                  <FaSyncAlt style={{ marginRight: "5px" }} />
                  Toggle Chart
                </button>
              </div>
              {orgChartType === "doughnut" ? <Doughnut data={orgStatusData} /> : <Pie data={orgStatusData} />}
            </div>

            {/* Users by Gender */}
            <div className="chart-box">
              <h3><FaVenusMars style={{ color: "#6bba62", marginRight: "6px" }} /> Users by Gender</h3>
              <Pie data={genderData} />
            </div>

          
         <div className="chart-box">
  <h3>
    <FaUserClock style={{ marginRight: "6px", color: "#356b29" }} />
    Pending Users
  </h3>
  <Doughnut data={pendingData} options={{ plugins: { legend: { position: "bottom" } }, cutout: '60%' }} />
</div>

          </div>
        </div>
      </div>
    </>
  );
};

export default AdminsDashboard;
