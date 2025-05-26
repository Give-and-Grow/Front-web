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
const handleFilterChange = (value, screen) => {
    console.log('Filter selected:', value, screen);
    setFilter(value);
    // ممكن هنا تجيب بيانات جديدة بحسب الفلتر لو عندك API منفصل
    navigate(screen);
  };
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

  // جلب المشاركين لفرصة معينة
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
      fetchParticipants(opportunityId);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const toggleExpand = (opportunityId) => {
    if (expandedOpportunityId === opportunityId) {
      setExpandedOpportunityId(null);
    } else {
      setExpandedOpportunityId(opportunityId);
      fetchParticipants(opportunityId);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleFilterSelect = (selectedFilter) => {
    setFilter(selectedFilter);
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
            <div>
              {opportunities.map(renderOpportunity)}
            </div>
          </div>
          {/* يمكنك إضافة مكون BottomTabBar هنا إذا كان لديك */}
        </div>
      </div>
    </div>
  </>
);

};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#e8f5e9',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    padding: 16,
    overflowY: 'auto',
  },
  title: {
    fontSize: 26,
    color: '#1b5e20',
    fontWeight: '900',
    marginBottom: 24,
    textAlign: 'center',
    textShadow: '1px 1px 3px #a5d6a7',
  },
  opportunityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 18,
    boxShadow: '0 5px 8px rgba(56, 142, 60, 0.2)',
  },
  opportunityHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#a5d6a7',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    boxShadow: '0 3px 6px rgba(129, 199, 132, 0.4)',
    cursor: 'pointer',
  },
  opportunityTitle: {
    fontSize: 20,
    color: '#1b5e20',
    fontWeight: 'bold',
    margin: 0,
  },
  participantsContainer: {
    padding: 10,
    maxHeight: 300,
    overflowY: 'auto',
  },
  participantCard: {
    display: 'flex',
    backgroundColor: '#e8f5e9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
    boxShadow: '0 4px 6px rgba(56, 142, 60, 0.15)',
    alignItems: 'center',
  },
  participantImage: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    marginRight: 15,
    objectFit: 'cover',
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 17,
    fontWeight: '600',
    margin: 0,
  },
  participantStatus: {
    fontSize: 14,
    color: '#2e7d32',
    margin: '6px 0',
  },
  buttons: {
    display: 'flex',
    gap: 12,
  },
  button: {
    borderRadius: 12,
    padding: '6px 14px',
    cursor: 'pointer',
    border: 'none',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
  },
  accept: {
    backgroundColor: '#388e3c',
    color: '#fff',
  },
  reject: {
    backgroundColor: '#c62828',
    color: '#fff',
  },
  card: {
  backgroundColor: '#2e7d32;',
  borderRadius: 16,
  padding: 24,
  boxShadow: '0 6px 15px rgba(56, 142, 60, 0.15)',
  maxWidth: 800,
  width: '100%',
  minHeight: 350,
  margin: '20px auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}



};

export default OrganizationRejectAcceptUser;
