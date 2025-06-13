import React, { useEffect, useState } from "react";
import FilterComponent from './FilterComponent';
import OpportunityFilters from "./OpportunityFilters";
import Navbar from './Navbar';  // عدل المسار حسب مكان ملف Navbar.js
export default function NearbyOpportunitiesUser() {

  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mainFilter, setMainFilter] = useState("Nearby");
  const [summaries, setSummaries] = useState({});
  const [summaryLoading, setSummaryLoading] = useState({});
  const [participationStatus, setParticipationStatus] = useState({});
  const [expandedOpportunities, setExpandedOpportunities] = useState({});
  const [showMoreDetails, setShowMoreDetails] = useState({});

 useEffect(() => {
  async function fetchOpportunities() {
    try {
      const token = localStorage.getItem("userToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(`http://localhost:5000/opportunities/nearby_opportunities`, {
        headers,
      });

      const data = await response.json();

      if (response.ok && data.opportunities) {
        // ✅ ترتيب الفرص حسب الحالة: open → pending → closed → full
        const sortedOpportunities = [...data.opportunities].sort((a, b) => {
          const priority = { open: 0, pending: 1, closed: 2, full: 3 };
          return (priority[a.status] ?? 99) - (priority[b.status] ?? 99);
        });

        setOpportunities(sortedOpportunities);
        setFilteredOpportunities(sortedOpportunities);
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
      // فلتر الحالة (status)
      if (filters.status && opp.status !== filters.status) return false;
  
      // فلتر نوع الفرصة (opportunity_type)
      if (filters.opportunity_type && opp.opportunity_type !== filters.opportunity_type) return false;
  
      // فلتر الموقع (location)
      if (filters.location && opp.location !== filters.location) return false;
  
      // فلتر المهارات (skill_id)
      if (filters.skill_id) {
        const skillIdStr = String(filters.skill_id);
        const hasSkill = opp.skills.some(s => String(s.id) === skillIdStr);
        if (!hasSkill) return false;
      }
  
      // فلتر المنظمة (organization_id)
      if (filters.organization_id && String(opp.organization_id) !== String(filters.organization_id)) return false;
  
      // فلتر التواريخ (start_date و end_date)
      if (filters.start_date && filters.end_date) {
        const toMinutesFromDate = (dateStr) => {
          if (!dateStr) return 0;
          const date = new Date(dateStr);
          return date.getHours() * 60 + date.getMinutes();
        };
  
        const oppStart = toMinutesFromDate(opp.start_date);
        const oppEnd = toMinutesFromDate(opp.end_date);
        const filterStart = toMinutesFromDate(filters.start_date);
        const filterEnd = toMinutesFromDate(filters.end_date);
  
        // نتحقق من تداخل الفترة
        if (!(oppStart < filterEnd && oppEnd > filterStart)) return false;
      }
  
      // فلتر أيام التطوع (volunteer_days)
      if (filters.volunteer_days && !opp.volunteer_days.includes(filters.volunteer_days)) return false;
  
      return true;
    });
  
    setFilteredOpportunities(filtered);
  };
  

  const handleMainFilterSelect = (value, screen) => {
    console.log('Selected Filter:', value, screen);
    // هنا ممكن تحدث الحالة أو تعمل تحديث حسب الفلتر المختار
  };
  
  const handleJoin = async (opportunityId) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await fetch(`http://localhost:5000/user-participation/${opportunityId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const result = await response.json();
      if (response.ok) {
        alert("✅ Joined successfully!");
        setParticipationStatus((prevStatus) => ({
          ...prevStatus,
          [opportunityId]: 'joined',
        }));
      } else {
        alert(result.msg || "Failed to join.");
      }
    } catch (error) {
      console.error("Join error:", error);
      alert("Failed to join the opportunity.");
    }
  };
 useEffect(() => {
  const fetchParticipationStatus = async () => {
  const newStatus = {};
  const token = localStorage.getItem("userToken");

  for (const opp of opportunities) {
    try {
      const res = await fetch(`http://localhost:5000/user-participation/${opp.id}/is_participant`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      newStatus[opp.id] = data.status || 'not_joined'; // ممكن تكون accepted, pending, rejected, أو null
    } catch (error) {
      console.error("Error fetching participation:", error);
      newStatus[opp.id] = 'error';
    }
  }

  setParticipationStatus(newStatus);
};


  if (opportunities.length > 0) {
    fetchParticipationStatus();
  }
}, [opportunities]);
  const handleLeave = async (opportunityId) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await fetch(`http://localhost:5000/user-participation/${opportunityId}/withdraw`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const result = await response.json();
      if (response.ok) {
        alert("❌ Left successfully!");
        setParticipationStatus((prevStatus) => ({
          ...prevStatus,
          [opportunityId]: 'not joined',
        }));
      } else {
        alert(result.msg || "Failed to leave.");
      }
    } catch (error) {
      console.error("Leave error:", error);
      alert("Failed to leave the opportunity.");
    }
  };
  const fetchSummary = async (oppId) => {
    if (summaries[oppId]) {
      // التلخيص موجود، نرجعه فوراً
      return summaries[oppId];
    }
  
    // في الويب بنستخدم localStorage بدل AsyncStorage
    const token = localStorage.getItem('userToken');
    if (!token) {
      alert('Please login first');
      return;
    }
  
    setSummaryLoading((prev) => ({ ...prev, [oppId]: true }));
  
    try {
      const response = await fetch(`http://localhost:5000/opportunities/summary/${oppId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      console.log("Summary data for oppId", oppId, data);
  
      if (response.ok && data.summary) {
        setSummaries((prev) => ({ ...prev, [oppId]: data.summary }));
        return data.summary;  // ترجع التلخيص اللي جاك من السيرفر
      } else {
        alert(data.msg || 'Failed to fetch summary');
        return null;
      }
    } catch (err) {
      console.error("Error fetching summary:", err);
      alert('An error occurred while fetching summary');
      return null;
    } finally {
      setSummaryLoading((prev) => ({ ...prev, [oppId]: false }));
    }
  };
  
  const toggleDetails = (id) => {
    setExpandedOpportunities(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
 const openLocationInMaps = (destination) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodeURIComponent(destination)}`;
        
        // افتح الرابط في تبويب جديد
        window.open(url, '_blank');
      },
      (error) => {
        console.error("Error getting location", error);
        const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;
        window.open(fallbackUrl, '_blank');
      }
    );
  } else {
    alert("المتصفح لا يدعم تحديد الموقع.");
  }
};

  return (
    < >
    <Navbar />
    <div style={styles.container}>
    <OpportunityFilters onFilterSelect={handleMainFilterSelect} initialFilter="Nearby" />

      <h1 style={styles.title}>🌱 Nearby Opportunities</h1>

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
        {filteredOpportunities.map((opp) => {
  const showDetails = showMoreDetails[opp.id];

  return (
    <div key={opp.id} style={styles.card}>
      {opp.image_url && (
        <img src={opp.image_url} alt={opp.title} style={styles.cardImage} />
      )}

      <h3 style={styles.cardTitle}>🎯 {opp.title}</h3>

      <p><strong>🏢 Organization:</strong> {opp.organization_name || opp.organization_id}</p>
      <p><strong>🕓 Time:</strong> {opp.start_time} - {opp.end_time}</p>
      <span style={styles.badge}>Distance: 📏 {opp.distance_km} km</span>

      <p><strong>📝 Description:</strong> {opp.description}</p>
     

      {/* Summary Section */}
      <div style={{ marginTop: 10 }}>
        {summaryLoading[opp.id] ? (
          <div style={{ textAlign: "center" }}>
            <div className="spinner" style={{
              width: 24, height: 24, border: '4px solid #ccc',
              borderTop: '4px solid #388e3c', borderRadius: '50%',
              animation: 'spin 1s linear infinite', margin: 'auto'
            }} />
          </div>
        ) : summaries[opp.id] ? (
          <div style={{ backgroundColor: '#e8f5e9', padding: 10, borderRadius: 10 }}>
            <p style={{ color: '#2e7d32', fontWeight: 'bold', margin: 0 }}>📌 Summary:</p>
            <p style={{ color: '#1b5e20', marginTop: 4 }}>{summaries[opp.id].summary}</p>
          </div>
        ) : (
          <button
            style={styles.summaryButton}
            onClick={() => fetchSummary(opp.id)}
          >
            ✨ View Summary
          </button>
        )}
      </div>

      {/* Show Details Button */}
      <button
        style={styles.showDetailsButton}
        onClick={() =>
          setShowMoreDetails((prev) => ({ ...prev, [opp.id]: !prev[opp.id] }))
        }
      >
        {showDetails ? "Hide Details ▲" : "Show Details ▼"}
      </button>

     {/* Additional Details if showDetails is true */}
                        {showDetails && (
                          <>
                            {opp.opportunity_type !== "job" && (
                              <div style={styles.volunteerDaysContainer}>
                                <span style={styles.volunteerDaysLabel}>📆 Volunteer Days:</span>
                                <span style={styles.volunteerDaysText}>{opp.volunteer_days.join(", ")}</span>
                              </div>
                            )}

                            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", margin: "12px 0" }}>
                              <div style={{ display: 'block', marginBottom: '10px' }}>
                                <div style={{ fontWeight: 'bold', color: '#388e3c', marginBottom: '4px' }}>
                                  📍 Location:
                                  <button onClick={() => openLocationInMaps(opp.location)} style={styles.badge}>
                                    View location
                                  </button>
                                </div>
                                <div>
                                  <span style={styles.badge}>{opp.location}</span>
                                </div>
                              </div>

                              <div style={{ display: 'block', marginBottom: '10px' }}>
                                <div style={{ fontWeight: 'bold', color: '#388e3c', marginBottom: '4px' }}>
                                  🎯 Opportunity Type:
                                </div>
                                <div>
                                  <span style={styles.badge}>{opp.opportunity_type}</span>
                                </div>
                              </div>

                              <div style={styles.skillsContainer}>
                                <p style={{ fontWeight: 'bold', color: '#388e3c', marginBottom: '4px' }}>
                                  🛠️ Skills Required:
                                </p>
                                {opp.skills.map((skill) => (
                                  <span key={skill.id} style={styles.badge}>
                                    💡 {skill.name}
                                  </span>
                                ))}
                              </div>

                              <div style={{ marginTop: '8px' }}>
                                <p style={{ fontWeight: 'bold', color: '#388e3c', marginBottom: '4px' }}>
                                  📌 Status:
                                </p>
                                <span style={styles.badge}>
                                  {opp.status?.toLowerCase() === "closed" ? "🔒 closed" : "🔓 open"}
                                </span>
                              </div>
                            </div>

                            <p><strong>📅 Start Date:</strong> {opp.start_date}</p>
                            <p><strong>📅 End Date:</strong> {opp.end_date}</p>
                            <p><strong>✉️ Contact:</strong> {opp.contact_email}</p>
                          </>
                        )}
      <div style={styles.joinWithdrawContainer}>
 

  {opp.status === 'filled' && (
    <button disabled style={{ ...styles.btn, ...styles.full }}>Full</button>
  )}

  {opp.status === 'open' && (
    <>
      {participationStatus[opp.id] === 'accepted' && (
        <button disabled style={{ ...styles.btn, ...styles.accepted }}>open_Accepted</button>
      )}

      {participationStatus[opp.id] === 'rejected' && (
        <button disabled style={{ ...styles.btn, ...styles.rejected }}>open_Rejected</button>
      )}

      {participationStatus[opp.id] === 'pending' && (
        <button onClick={() => handleLeave(opp.id)} style={{ ...styles.btn, ...styles.withdraw }}>Withdraw</button>
      )}

      {!participationStatus[opp.id] || participationStatus[opp.id] === 'not_joined' ? (
        <button onClick={() => handleJoin(opp.id)} style={{ ...styles.btn, ...styles.join }}>Join</button>
      ) : null}
    </>
  )}
</div>
{opp.status === 'closed' && (
  <>
    {participationStatus[opp.id] === 'accepted' && (
      <button disabled style={{ ...styles.btn, ...styles.accepted }}>
        Accepted – Closed
      </button>
    )}

    {participationStatus[opp.id] === 'rejected' && (
      <button disabled style={{ ...styles.btn, ...styles.rejected }}>
        Rejected – Closed
      </button>
    )}

    {participationStatus[opp.id] === 'pending' && (
      <button onClick={() => handleLeave(opp.id)} style={{ ...styles.btn, ...styles.withdraw }}>
        Withdraw – Closed
      </button>
    )}

    {!participationStatus[opp.id] || participationStatus[opp.id] === 'not_joined' ? (
      <button disabled style={{ ...styles.btn, ...styles.closed }}>
        Closed
      </button>
    ) : null}
  </>
)}


      {/* CSS for spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
})}




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
   closed: {
    backgroundColor: "#9e9e9e",
    color: "#fff",
    cursor: "not-allowed",
    opacity: 0.7,
  },
  full: {
    backgroundColor: "#795548",
    color: "#fff",
    cursor: "not-allowed",
    opacity: 0.7,
  },
  btn: {
    padding: "10px 20px",
    fontSize: 16,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    marginRight: 10,
    marginTop: 10,
    transition: "0.3s",
  },
  join: {
    backgroundColor: "#4caf50",
    color: "#fff",
  },
  withdraw: {
    backgroundColor: "#ff9800",
    color: "#fff",
  },
  accepted: {
    backgroundColor: "#2196f3",
    color: "#fff",
    cursor: "not-allowed",
    opacity: 0.7,
  },
  rejected: {
    backgroundColor: "#f44336",
    color: "#fff",
    cursor: "not-allowed",
    opacity: 0.7,
  },
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

  joinButton: {
    background: "linear-gradient(90deg, #66bb6a 0%, #43a047 100%)",
    color: "#fff",
    fontWeight: "600",
    border: "none",
    padding: "10px 22px",
    borderRadius: "30px",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(102, 187, 106, 0.4)",
    transition: "transform 0.3s ease, opacity 0.3s ease",
    fontSize: "16px",
    minWidth: "300px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  leaveButton: {
    background: "linear-gradient(90deg, #81c784 0%, #388e3c 100%)",
    color: "#fff",
    fontWeight: "600",
    border: "none",
    padding: "10px 22px",
    borderRadius: "30px",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(129, 199, 132, 0.4)",
    transition: "transform 0.3s ease, opacity 0.3s ease",
    fontSize: "16px",
    minWidth: "300px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
   
  },
  
  card: {
    backgroundColor: "#f0f4f8",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
    marginBottom: "25px",
    maxWidth: "600px",
    margin: "auto",
  },
  cardImage: {
    width: "100%",
    height: "auto",
    borderRadius: "12px",
    marginBottom: "15px",
  },
  cardTitle: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "10px",
  },
 

  
    volunteerDaysContainer: {
      marginTop: "12px",
      padding: "10px 15px",
      backgroundColor: "#e8f5e9", // أخضر فاتح جداً (light green)
      borderRadius: "8px",
      display: "inline-block",
      boxShadow: "0 2px 6px rgba(76, 146, 58, 0.15)", // ظل أخضر فاتح
    },
    volunteerDaysLabel: {
      fontWeight: "700",
      color: "#388e3c", // أخضر متوسط غامق
      marginRight: "8px",
      fontSize: "16px",
    },
    volunteerDaysText: {
      fontWeight: "500",
      color: "#2e7d32", // أخضر داكن
      fontSize: "15px",
    }
,
sidebar: {
  minWidth: 280,
  maxHeight:700,          // تحديد ارتفاع للصندوق عشان يظهر السكروول
  backgroundColor: "#e8f5e9",
  padding: 20,
  borderRadius: 10,
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  position: "sticky",      // تثبيت مكان الصندوق عند التمرير
  top: 20,                 // المسافة من الأعلى عند التثبيت
  alignSelf: "flex-start", // لتحسين التوافق مع sticky في flexbox
  overflowY: "auto",       // تفعيل السكروول عمودياً عند المحتوى الكبير
},
 row: {
    display: 'flex',
    gap: '12px',
    marginTop: 10,
  },
  button: {
    padding: '10px 22px',
    backgroundColor: '#4CAF50',  // أخضر جذاب
    color: 'white',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: '600',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    transition: 'background-color 0.3s ease, transform 0.15s ease',
  },
  buttonHover: {
    backgroundColor: '#45a049',
    transform: 'scale(1.05)',
  },
  buttonActive: {
    backgroundColor: '#3e8e41',
    transform: 'scale(0.95)',
  },

  joinWithdrawContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: '10px 0',
  },
  joinWithdrawButton: {
    fontSize: '18px',               // حجم أكبر شوي
    padding: '12px 40px',           // عرض أكبر (40px بدل 20px)
    border: 'none',
    borderRadius: '30px',           // مدور أكثر
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease',
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
    userSelect: 'none',
  },
  joinButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  leaveButton: {
    backgroundColor: '#f44336',
    color: 'white',
  },
  joinButtonHover: {
    backgroundColor: '#45a049',
    boxShadow: '0 6px 12px rgba(76, 175, 80, 0.6)',
    transform: 'scale(1.05)',
  },
  leaveButtonHover: {
    backgroundColor: '#da190b',
    boxShadow: '0 6px 12px rgba(244, 67, 54, 0.6)',
    transform: 'scale(1.05)',
  },
  badge: {
    display: 'inline-block',
    backgroundColor: '#d0f0c0',  // أخضر فاتح جدا (Pastel green)
    color: '#2e7d32',            // أخضر متوسط غامق (Dark green)
    padding: '5px 12px',
    margin: '4px',
    borderRadius: '15px',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 2px 5px rgba(46, 125, 50, 0.2)', // ظل أخضر فاتح شفاف
    userSelect: 'none',
    cursor: 'default',
  },
  
  skillsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '10px',
    justifyContent: 'flex-start',
  },
  showDetailsButton: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  
  summaryButton: {
    backgroundColor: '#a5d6a7',
    padding: 10,
    borderRadius: 10,
    marginTop: 5,
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    color: '#1b5e20',
    fontWeight: 'bold',
    textAlign: 'center'
  }
  
};
