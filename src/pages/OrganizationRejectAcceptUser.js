import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';  // عدل المسار حسب مكان ملف Navbar.js
import { useNavigate } from 'react-router-dom';

const OrganizationRejectAcceptUser = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orgrejectoraccept');
  const [filter, setFilter] = useState("evaluate");
  const [opportunities, setOpportunities] = useState([]);
  const [expandedOpportunityId, setExpandedOpportunityId] = useState(null);
  const [participantsMap, setParticipantsMap] = useState({});
  const [loading, setLoading] = useState(false);

  // جلب الفرص
  const fetchOpportunities = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        console.warn('No token found, please login first.');
        setOpportunities([]);
        return;
      }
      const res = await fetch(`http://localhost:5000/opportunities/organization`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data.opportunities)) {
        setOpportunities(data.opportunities);
      } else {
        setOpportunities([]);
        console.warn('Unexpected response format:', data);
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      setOpportunities([]);
    }
  };

  // جلب المشاركين لفرصة معينة بدون فلترة
  const fetchParticipants = async (opportunityId) => {
    if (!opportunityId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(
        `http://localhost:5000/org/opportunities/${opportunityId}/participants`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setParticipantsMap((prev) => ({
        ...prev,
        [opportunityId]: Array.isArray(data) ? data : [],
      }));
    } catch (error) {
      console.error('Error fetching participants:', error);
      setParticipantsMap((prev) => ({ ...prev, [opportunityId]: [] }));
    } finally {
      setLoading(false);
    }
  };

  // جلب المشاركين مع فلترة حسب الحالة
  const fetchParticipantsByStatus = async (opportunityId, status) => {
    if (!opportunityId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      // نرسل الحالة كـ query param 
      const url = status
        ? `http://localhost:5000/org/opportunities/${opportunityId}/participants?status=${status}`
        : `http://localhost:5000/org/opportunities/${opportunityId}/participants`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setParticipantsMap((prev) => ({
        ...prev,
        [opportunityId]: Array.isArray(data) ? data : [],
      }));
    } catch (error) {
      console.error('Error fetching participants by status:', error);
      setParticipantsMap((prev) => ({ ...prev, [opportunityId]: [] }));
    } finally {
      setLoading(false);
    }
  };

  // تغيير حالة مشاركة
  const updateStatus = async (opportunityId, userId, status) => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(
        `http://localhost:5000/org/opportunities/${opportunityId}/participants/${userId}/status`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      const result = await res.json();
      alert(result.message);
      // تحديث المشاركين بحسب الفلتر الحالي
      fetchParticipantsByStatus(opportunityId, filter);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // فتح أو إغلاق تفاصيل فرصة
  const toggleExpand = (opportunityId) => {
    if (expandedOpportunityId === opportunityId) {
      setExpandedOpportunityId(null);
    } else {
      setExpandedOpportunityId(opportunityId);
      fetchParticipantsByStatus(opportunityId, filter);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  // عند تغيير الفلتر نحدث المشاركين للفرصة المفتوحة حاليًا
  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);
    if (expandedOpportunityId) {
      fetchParticipantsByStatus(expandedOpportunityId, selectedFilter);
    }
  };

  const renderParticipant = (item, opportunityId) => {
    const { status, user_id, user_name, user_profile_image } = item;
    return (
      <div key={user_id} style={styles.participantCard}>
        <img
          src={user_profile_image || 'https://via.placeholder.com/100'}
          alt={user_name}
          style={styles.participantImage}
        />
        <div style={styles.participantInfo}>
          <p style={styles.participantName}>{user_name}</p>
          <p style={styles.participantStatus}>Status: {status}</p>
          <div style={styles.buttons}>
            {status === 'accepted' && (
              <button
                style={{ ...styles.button, ...styles.reject }}
                onClick={() => updateStatus(opportunityId, user_id, 'rejected')}
              >
                ✘ Reject
              </button>
            )}
            {status === 'rejected' && (
              <button
                style={{ ...styles.button, ...styles.accept }}
                onClick={() => updateStatus(opportunityId, user_id, 'accepted')}
              >
                ✔ Accept
              </button>
            )}
            {status !== 'accepted' && status !== 'rejected' && (
              <>
                <button
                  style={{ ...styles.button, ...styles.accept }}
                  onClick={() => updateStatus(opportunityId, user_id, 'accepted')}
                >
                  ✔ Accept
                </button>
                <button
                  style={{ ...styles.button, ...styles.reject }}
                  onClick={() => updateStatus(opportunityId, user_id, 'rejected')}
                >
                  ✘ Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderOpportunity = (item) => {
    const isExpanded = item.id === expandedOpportunityId;
    const participants = participantsMap[item.id] || [];

    return (
      <div key={item.id} style={styles.opportunityCard}>
        <div
          style={styles.opportunityHeader}
          onClick={() => toggleExpand(item.id)}
          role="button"
          tabIndex={0}
          onKeyPress={() => toggleExpand(item.id)}
        >
          <p style={styles.opportunityTitle}>{item.title}</p>
          <span style={{ color: '#2e7d32', fontSize: 28 }}>
            {isExpanded ? '▲' : '▼'}
          </span>
        </div>

        {isExpanded && (
          <div style={styles.participantsContainer}>
            {loading ? (
              <p>Loading...</p>
            ) : participants.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666' }}>No participants found.</p>
            ) : (
              participants.map((p) => renderParticipant(p, item.id))
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <div style={styles.container}>
          <div style={styles.content}>
            <div style={styles.card}>
              <h2 style={styles.title}>Volunteer Applications</h2>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <select
                  value={filter}
                  onChange={handleFilterChange}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '12px',
                    border: '2px solid #66bb6a',
                    fontSize: '16px',
                    backgroundColor: '#f1f8e9',
                    color: '#2e7d32',
                    fontWeight: 'bold',
                    outline: 'none',
                    boxShadow: '0 2px 6px rgba(102, 187, 106, 0.3)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                {opportunities.map(renderOpportunity)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    maxWidth: 1000,
    margin: '0 auto',
    padding: 20,
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 10,
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    padding: 20,
  },
  card: {
    marginTop: 10,
  },
  title: {
    textAlign: 'center',
    color: '#2e7d32',
  },
  opportunityCard: {
    border: '1px solid #ddd',
    borderRadius: 8,
    marginBottom: 15,
  },
  opportunityHeader: {
    padding: '12px 16px',
    backgroundColor: '#c8e6c9',
    display: 'flex',
    justifyContent: 'space-between',
    cursor: 'pointer',
    userSelect: 'none',
  },
  opportunityTitle: {
    margin: 0,
    fontWeight: 'bold',
  },
  participantsContainer: {
    padding: 10,
    backgroundColor: '#f1f8e9',
    borderTop: '1px solid #ddd',
  },
  participantCard: {
    display: 'flex',
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 6,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: 10,
  },
  participantImage: {
    width: 60,
    height: 60,
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: 15,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    margin: 0,
    fontWeight: 'bold',
  },
  participantStatus: {
    margin: '4px 0',
  },
  buttons: {
    marginTop: 6,
  },
  button: {
    padding: '6px 12px',
    marginRight: 8,
    borderRadius: 5,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  accept: {
    backgroundColor: '#4caf50',
    color: 'white',
  },
  reject: {
    backgroundColor: '#f44336',
    color: 'white',
  },
};

export default OrganizationRejectAcceptUser;
