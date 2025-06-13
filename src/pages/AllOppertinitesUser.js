import React, { useEffect, useState } from "react";
import FilterComponent from './FilterComponent';
import OpportunityFilters from "./OpportunityFilters";
import Navbar from '../pages/Navbar';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import AdComponent from '../components/AdComponent';

const SkeletonCard = () => (
  <div style={styless.card}>
    <div style={{ ...styless.cardImage, ...styless.skeleton }} />
    <div style={{ ...styless.cardLine, width: '60%' }} />
    <div style={{ ...styless.cardLine, width: '80%' }} />
    <div style={{ ...styless.cardLine, width: '70%' }} />
    <div style={{ ...styless.cardLine, width: '50%' }} />
    <div style={{ ...styless.cardButton, width: '60%' }} />
    <div style={{ ...styless.cardButton, width: '80%' }} />
    <div style={styless.joinWithdrawContainer}>
      <div style={{ ...styless.btn, ...styless.skeleton, width: 120 }} />
    </div>
  </div>
);
// حركة الشيمر
function shimmerStyle() {
  return {
    background: 'linear-gradient(90deg, #ddd 25%, #eee 50%, #ddd 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  };
}

const styless = {
  card: {
    width: 300, // أعرض من قبل
    padding: '20px',
    background: '#f2f2f2',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '10px',
  },
  cardImage: {
    width: '100%',
    height: 160,
    borderRadius: '8px',
    marginBottom: 16,
  },
  cardLine: {
    height: 20,
    borderRadius: 4,
    marginBottom: 10,
    ...shimmerStyle(),
  },
  cardButton: {
    height: 32,
    borderRadius: 6,
    marginBottom: 10,
    ...shimmerStyle(),
  },
  btn: {
    height: 40,
    borderRadius: 8,
    ...shimmerStyle(),
  },
  joinWithdrawContainer: {
    marginTop: 16,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  skeleton: {
    backgroundColor: '#ccc',
    position: 'relative',
    overflow: 'hidden',
    ...shimmerStyle(),
  },
};



export default function AllOpportunitiesUser() {
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [summaries, setSummaries] = useState({});
  const [summaryLoading, setSummaryLoading] = useState({});
  const [participationStatus, setParticipationStatus] = useState({});
  const [buttonLoading, setButtonLoading] = useState({}); // New state for per-opportunity button loading
  const [expandedOpportunities, setExpandedOpportunities] = useState({});
  const [showMoreDetails, setShowMoreDetails] = useState({});
  const [filter, setFilter] = useState('All');
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type });
  };

  const closeToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  useEffect(() => {
    async function fetchOpportunitiesAndParticipation() {
      try {
        const token = localStorage.getItem("userToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Fetch opportunities
        const response = await fetch(`http://localhost:5000/opportunities/list`, {
          headers,
        });

        const data = await response.json();

        if (response.ok && data.opportunities) {
          // Sort opportunities: open → pending → closed → full
          const sortedOpportunities = [...data.opportunities].sort((a, b) => {
            const priority = { open: 0, pending: 1, closed: 2, full: 3 };
            return (priority[a.status] ?? 99) - (priority[b.status] ?? 99);
          });

          // Initialize button loading state
          const initialButtonLoading = sortedOpportunities.reduce((acc, opp) => ({
            ...acc,
            [opp.id]: true,
          }), {});
          setButtonLoading(initialButtonLoading);

          // Fetch participation status for all opportunities in parallel
          const participationPromises = sortedOpportunities.map(async (opp) => {
            try {
              const res = await fetch(`http://localhost:5000/user-participation/${opp.id}/is_participant`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              });
              const participationData = await res.json();
              return { id: opp.id, status: participationData.status || 'not_joined' };
            } catch (error) {
              console.error(`Error fetching participation for opp ${opp.id}:`, error);
              return { id: opp.id, status: 'error' };
            }
          });

          const participationResults = await Promise.all(participationPromises);
          const newParticipationStatus = participationResults.reduce((acc, { id, status }) => ({
            ...acc,
            [id]: status,
          }), {});
          const newButtonLoading = participationResults.reduce((acc, { id }) => ({
            ...acc,
            [id]: false,
          }), {});

          // Set state
          setOpportunities(sortedOpportunities);
          setFilteredOpportunities(sortedOpportunities);
          setParticipationStatus(newParticipationStatus);
          setButtonLoading(newButtonLoading);
        } else {
          setError(data.msg || "No opportunities found.");
          showToast(data.msg || "No opportunities found.", 'error');
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch opportunities.");
        showToast("Failed to fetch opportunities.", 'error');
      } finally {
        setLoading(false);
      }
    }

    fetchOpportunitiesAndParticipation();
  }, []);

  const applyFilters = (filters) => {
    const isEmpty = Object.values(filters).every(value => !value || value === "");

    if (isEmpty) {
      setFilteredOpportunities(opportunities);
      return;
    }

    const filtered = opportunities.filter((opp) => {
      if (filters.status && (!opp.status || opp.status.toLowerCase() !== filters.status.toLowerCase())) return false;
      if (filters.opportunity_type && opp.opportunity_type !== filters.opportunity_type) return false;
      if (filters.location && opp.location !== filters.location) return false;
      if (filters.skill_id) {
        const skillIdStr = String(filters.skill_id);
        if (!opp.skills || !opp.skills.some(s => String(s.id) === skillIdStr)) return false;
      }
      if (filters.organization_id && String(opp.organization_id) !== String(filters.organization_id)) return false;

      const parseTime = (timeStr) => {
        if (!timeStr) return null;
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      };

      if (filters.start_time && (!opp.start_time || parseTime(opp.start_time) < parseTime(filters.start_time))) return false;
      if (filters.end_time && (!opp.end_time || parseTime(opp.end_time) > parseTime(filters.end_time))) return false;
      if (filters.volunteer_days && (!opp.volunteer_days || !opp.volunteer_days.includes(filters.volunteer_days))) return false;

      return true;
    });

    setFilteredOpportunities(filtered);
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
        showToast("Joined successfully!", 'success');
        setParticipationStatus((prevStatus) => ({
          ...prevStatus,
          [opportunityId]: 'pending', // Assume 'pending' until approved/rejected
        }));
      } else {
        showToast(result.msg || "Failed to join.", 'error');
      }
    } catch (error) {
      console.error("Join error:", error);
      showToast("Failed to join the opportunity.", 'error');
    }
  };

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
        showToast("Left successfully!", 'success');
        setParticipationStatus((prevStatus) => ({
          ...prevStatus,
          [opportunityId]: 'not_joined',
        }));
      } else {
        showToast(result.msg || "Failed to leave.", 'error');
      }
    } catch (error) {
      console.error("Leave error:", error);
      showToast("Failed to leave the opportunity.", 'error');
    }
  };

  const fetchSummary = async (oppId) => {
    if (summaries[oppId]) return summaries[oppId];

    const token = localStorage.getItem('userToken');
    if (!token) {
      showToast('Please login first', 'error');
      return;
    }

    setSummaryLoading((prev) => ({ ...prev, [oppId]: true }));

    try {
      const response = await fetch(`http://localhost:5000/opportunities/summary/${oppId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok && data.summary) {
        setSummaries((prev) => ({ ...prev, [oppId]: typeof data.summary === 'string' ? { summary: data.summary } : data.summary }));
        return typeof data.summary === 'string' ? { summary: data.summary } : data.summary;
      } else {
        showToast(data.msg || 'Failed to fetch summary', 'error');
        return null;
      }
    } catch (err) {
      console.error("Error fetching summary:", err);
      showToast('An error occurred while fetching summary', 'error');
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

  const handleFilterChange = (value, screen) => {
    setFilter(value);
    navigate(screen);
  };

  const openLocationInMaps = (destination) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodeURIComponent(destination)}`;
          window.open(url, '_blank');
        },
        (error) => {
          console.error("Error getting location", error);
          const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;
          window.open(fallbackUrl, '_blank');
        }
      );
    } else {
      showToast("Geolocation is not supported by this browser.", 'error');
    }
  };

  return (
    <>
      <Navbar />
      <AdComponent />
      <div style={styles.container}>
        <OpportunityFilters
          initialFilter="All"
          onFilterSelect={handleFilterChange}
        />
        <h1 style={styles.title}>🌱 Available Opportunities</h1>

        <div style={styles.contentWrapper}>
          <div style={styles.sidebar}>
            <h3 style={styles.sidebarTitle}>🔍 Filter</h3>
            <FilterComponent onApplyFilters={applyFilters} />
          </div>

          <div style={styles.opportunityList}>
            {loading ? (
              // <p>Loading opportunities...</p>
              <div style={styles.cardsGrid}>
                {[...Array(6)].map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
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
                        <p><strong>📝 Description:</strong> {opp.description}</p>

                        <div style={{ marginTop: 10 }}>
                          {summaryLoading[opp.id] ? (
                            <div style={{ textAlign: "center" }}>
                              <div style={{
                                width: 24,
                                height: 24,
                                border: '4px solid #ccc',
                                borderTop: '4px solid #388e3c',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                margin: 'auto'
                              }} />
                            </div>
                          ) : summaries[String(opp.id)] ? (
                            <div style={{ backgroundColor: '#e8f5e9', padding: 10, borderRadius: 10 }}>
                              <p style={{ color: '#2e7d32', fontWeight: 'bold', margin: 0 }}>
                                📌 Summary:
                              </p>
                              <p style={{ color: '#1b5e20', marginTop: 4 }}>{summaries[String(opp.id)].summary || 'No summary text'}</p>
                            </div>
                          ) : (
                            <button
                              style={styles.summaryButton}
                              onClick={() => fetchSummary(String(opp.id))}
                            >
                              ✨ View Summary
                            </button>
                          )}
                        </div>

                        <button
                          style={styles.showDetailsButton}
                          onClick={() =>
                            setShowMoreDetails((prev) => ({ ...prev, [opp.id]: !prev[opp.id] }))
                          }
                        >
                          {showDetails ? "Hide Details ▲" : "Show Details ▼"}
                        </button>

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
                          {buttonLoading[opp.id] ? (
                            <button disabled style={{ ...styles.btn, ...styles.loading }}>
                              Loading...
                            </button>
                          ) : opp.status === 'filled' ? (
                            <button disabled style={{ ...styles.btn, ...styles.full }}>
                              Full
                            </button>
                          ) : opp.status === 'open' ? (
                            <>
                              {participationStatus[opp.id] === 'accepted' && (
                                <button disabled style={{ ...styles.btn, ...styles.accepted }}>
                                  Accepted
                                </button>
                              )}
                              {participationStatus[opp.id] === 'rejected' && (
                                <button disabled style={{ ...styles.btn, ...styles.rejected }}>
                                  Rejected
                                </button>
                              )}
                              {participationStatus[opp.id] === 'pending' && (
                                <button onClick={() => handleLeave(opp.id)} style={{ ...styles.btn, ...styles.withdraw }}>
                                  Withdraw
                                </button>
                              )}
                              {(!participationStatus[opp.id] || participationStatus[opp.id] === 'not_joined') && (
                                <button onClick={() => handleJoin(opp.id)} style={{ ...styles.btn, ...styles.join }}>
                                  Join
                                </button>
                              )}
                            </>
                          ) : opp.status === 'closed' ? (
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
                              {(!participationStatus[opp.id] || participationStatus[opp.id] === 'not_joined') && (
                                <button disabled style={{ ...styles.btn, ...styles.closed }}>
                                  Closed
                                </button>
                              )}
                            </>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>
        </div>
      </div>
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />
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
    maxHeight: 700,
    backgroundColor: "#e8f5e9",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 20,
    alignSelf: "flex-start",
    overflowY: "auto",
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
    backgroundColor: "#e8f5e9",
    borderRadius: "8px",
    display: "inline-block",
    boxShadow: "0 2px 6px rgba(76, 146, 58, 0.15)",
  },
  volunteerDaysLabel: {
    fontWeight: "700",
    color: "#388e3c",
    marginRight: "8px",
    fontSize: "16px",
  },
  volunteerDaysText: {
    fontWeight: "500",
    color: "#2e7d32",
    fontSize: "15px",
  },
  row: {
    display: 'flex',
    gap: '12px',
    marginTop: 10,
  },
  button: {
    padding: '10px 22px',
    backgroundColor: '#4CAF50',
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
    fontSize: '18px',
    padding: '12px 40px',
    border: 'none',
    borderRadius: '30px',
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
    backgroundColor: '#d0f0c0',
    color: '#2e7d32',
    padding: '5px 12px',
    margin: '4px',
    borderRadius: '15px',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 2px 5px rgba(46, 125, 50, 0.2)',
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
  },
  
  
};