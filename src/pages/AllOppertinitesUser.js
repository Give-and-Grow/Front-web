import React, { useEffect, useState } from "react";
import FilterComponent from './FilterComponent';
import OpportunityFilters from "./OpportunityFilters";
import Navbar from '../pages/Navbar';  // عدل المسار حسب مكان ملف Navbar.js
export default function AllOpportunitiesUser() {
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mainFilter, setMainFilter] = useState("All");

  useEffect(() => {
    async function fetchOpportunities() {
      try {
        const token = localStorage.getItem("userToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await fetch(`http://localhost:5000/opportunities/list`, {
          headers,
        });

        const data = await response.json();

        if (response.ok && data.opportunities) {
          setOpportunities(data.opportunities);
          setFilteredOpportunities(data.opportunities);
        } else {
          setError(data.msg || "No opportunities found.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch opportunities.");
      } finally {
        setLoading(false);
      }
    }

    fetchOpportunities();
  }, []);

  const applyFilters = (filters) => {
    const isEmpty = Object.values(filters).every(value => !value || value === "");

    if (isEmpty) {
      setFilteredOpportunities(opportunities);
      return;
    }

    const filtered = opportunities.filter((opp) => {
      if (filters.status && opp.status !== filters.status) return false;
      if (filters.opportunity_type && opp.opportunity_type !== filters.opportunity_type) return false;
      if (filters.location && opp.location !== filters.location) return false;
      if (filters.skill_id && String(opp.skill_id) !== filters.skill_id) return false;
      if (filters.organization_id && String(opp.organization_id) !== filters.organization_id) return false;

      if (filters.start_time && filters.end_time) {
        const toMinutes = (t) => {
          const [h, m] = t.split(":").map(Number);
          return h * 60 + m;
        };

        const oppStart = opp.start_time ? toMinutes(opp.start_time) : 0;
        const oppEnd = opp.end_time ? toMinutes(opp.end_time) : 1440;
        const filterStart = toMinutes(filters.start_time);
        const filterEnd = toMinutes(filters.end_time);

        if (!(oppStart < filterEnd && oppEnd > filterStart)) return false;
      }

      if (filters.volunteer_days && !opp.volunteer_days.includes(filters.volunteer_days)) return false;

      return true;
    });

    setFilteredOpportunities(filtered);
  };

  const handleMainFilterSelect = (value) => {
    setMainFilter(value);
  };

  return (
    < >
    <Navbar />
    <div style={styles.container}>
      <OpportunityFilters onFilterSelect={handleMainFilterSelect} initialFilter="All" />
      <h1 style={styles.title}>🌱 Available Opportunities</h1>

      <div style={styles.contentWrapper}>
        {/* Sidebar Filters */}
        <div style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>🔍 Filter</h3>
          <FilterComponent onApplyFilters={applyFilters} />
        </div>

        {/* Opportunities List */}
        <div style={styles.opportunityList}>
          {loading ? (
            <p>Loading opportunities...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : (
            filteredOpportunities.length === 0 ? (
              <p>No opportunities match the filters.</p>
            ) : (
              <div style={styles.cardsGrid}>
                {filteredOpportunities.map((opp) => (
                  <div key={opp._id} style={styles.card}>
                    {opp.image_url && (
                      <img src={opp.image_url} alt={opp.title} style={styles.cardImage} />
                    )}
                    <h3 style={styles.cardTitle}>{opp.title}</h3>
                    <p><strong>Type:</strong> {opp.opportunity_type}</p>
                    <p><strong>Status:</strong> {opp.status}</p>
                    <p><strong>Location:</strong> {opp.location}</p>
                    <p><strong>Time:</strong> {opp.start_time} - {opp.end_time}</p>
                    <p><strong>Days:</strong> {opp.volunteer_days?.join(", ")}</p>
                    <p><strong>Skill ID:</strong> {opp.skill_id}</p>
                    <p><strong>Organization ID:</strong> {opp.organization_id}</p>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: 1200,
    margin: "auto",
    padding: 20,
    fontFamily: "Segoe UI, sans-serif",
    backgroundColor: "#f4fdf6",
  },
  title: {
    color: "#2e7d32",
    marginBottom: 20,
  },
  contentWrapper: {
    display: "flex",
    gap: 20,
    alignItems: "flex-start",
  },
  sidebar: {
    minWidth: 280,
    backgroundColor: "#e8f5e9",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  sidebarTitle: {
    marginBottom: 10,
    color: "#1b5e20",
  },
  opportunityList: {
    flex: 1,
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    borderLeft: "5px solid #66bb6a",
  },
  cardImage: {
    width: "100%",
    maxHeight: 180,
    objectFit: "cover",
    borderRadius: 6,
    marginBottom: 10,
  },
  cardTitle: {
    margin: "10px 0",
    color: "#388e3c",
  },
};
