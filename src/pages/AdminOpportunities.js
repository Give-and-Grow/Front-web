import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import './AdminOpportunities.css';

import Navbar from '../pages/Navbar';
import Sidebar from './Sidebar';

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A", "#8884D8"];

export default function AdminOpportunities() {
  const [opportunityTypeData, setOpportunityTypeData] = useState([]);
  const [opportunityStatusData, setOpportunityStatusData] = useState([]);
  const [topOrgsData, setTopOrgsData] = useState([]);
  const [leastActiveOrgsData, setLeastActiveOrgsData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [weekdayData, setWeekdayData] = useState([]);
  const [topParticipationOrgs, setTopParticipationOrgs] = useState([]);
useEffect(() => {
  async function fetchData() {
    try {
      const token = localStorage.getItem("userToken");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [
        typeRes,
        statusRes,
        topOrgsRes,
        leastActiveRes,
        monthlyRes,
        weekdayRes,
        participationRes,
      ] = await Promise.all([
        axios.get(`http://localhost:5000/admin/opportunities/stats/by-type`, config),
        axios.get(`http://localhost:5000/admin/opportunities/stats/by-status`, config),  // صححت الرابط هنا
        axios.get(`http://localhost:5000/admin/opportunities/stats/top-organizations?limit=5`, config),
        axios.get(`http://localhost:5000/admin/opportunities/stats/least-active-organizations?limit=5`, config),
        axios.get(`http://localhost:5000/admin/opportunities/stats/by-month`, config),
        axios.get(`http://localhost:5000/admin/opportunities/stats/by-day`, config),
        axios.get(`http://localhost:5000/admin/opportunities/stats/top-organizations-by-participation`, config),
      ]);

      const typeDataArr = Object.entries(typeRes.data.opportunity_counts_by_type).map(([type, count]) => ({
        type,
        count,
      }));

      const statusDataArr = Object.entries(statusRes.data.opportunity_counts_by_status).map(([status, count]) => ({
        status,
        count,
      }));

      setOpportunityTypeData(typeDataArr);
      setOpportunityStatusData(statusDataArr);
      setTopOrgsData(topOrgsRes.data.top_organizations);
      setLeastActiveOrgsData(leastActiveRes.data.least_active_organizations);
      setMonthlyData(monthlyRes.data.opportunities_by_month);
      setWeekdayData(weekdayRes.data.volunteer_opportunities_by_day);
      setTopParticipationOrgs(participationRes.data.top_organizations_by_participation);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    }
  }

  fetchData();
}, []);


  return (
     <>
      <Navbar />
          <Sidebar />
       <div className="admin-opportunities-container">
    
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      
      {/* فرص حسب النوع */}
      <section>
        <h2>Opportunity Counts by Type</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={opportunityTypeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#0088FE" />
          </BarChart>
        </ResponsiveContainer>
      </section>

 

      {/* فرص حسب الشهر */}
      <section>
        <h2>Opportunities by Month</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="opportunity_count" fill="#FFBB28" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section>
  <h2 className="weekday-section-title">Volunteer Opportunities by Weekday</h2>
  <div className="weekday-pie-chart-container">
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={weekdayData}
          dataKey="opportunity_count"
          nameKey="day"
          cx="50%"
          cy="50%"
          outerRadius={120}
          label
        >
          {weekdayData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
</section>
    <section className="stats-section">
  {/* Top Organizations by Opportunity Count */}
  <div className="stat-card">
    <h3>Top Organizations by Opportunity Count</h3>
    <ul>
      {topOrgsData.map(({ organization, opportunity_count }, idx) => (
        <li key={idx}>{organization}: {opportunity_count}</li>
      ))}
    </ul>
  </div>

  {/* Least Active Organizations */}
  <div className="stat-card">
    <h3>Least Active Organizations</h3>
    <ul>
      {leastActiveOrgsData.map(({ organization, opportunity_count }, idx) => (
        <li key={idx}>{organization}: {opportunity_count}</li>
      ))}
    </ul>
  </div>

  {/* Top Organizations by Participation */}
  <div className="stat-card">
    <h3>Top Organizations by Participation</h3>
    <ul>
      {topParticipationOrgs.map(({ organization_name, participant_count }, idx) => (
        <li key={idx}>{organization_name}: {participant_count} participants</li>
      ))}
    </ul>
  </div>
</section>
    </div>
    </div> 
       </>
  );
}
