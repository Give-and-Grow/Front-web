import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import OpportunityFilters from './OpportunityFilters';


const ApplicationsScreen = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const [filter, setFilter] = useState('Eval');

  useEffect(() => {
    const loadTokenAndFetch = async () => {
      try {
        const storedToken = localStorage.getItem('userToken');
        setToken(storedToken);
        if (storedToken) {
          await fetchApplications(storedToken);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    loadTokenAndFetch();
  }, []);

  const fetchApplications = async (authToken) => {
    try {
      const res = await axios.get(`http://localhost:5000/user-participation/applications`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = (applicationId) => {
    navigate(`/certificate/${applicationId}`);
  };
  const handleFilterChange = (value, screen) => {
    console.log('Filter selected:', value, screen);
    setFilter(value);
    // ممكن هنا تجيب بيانات جديدة بحسب الفلتر لو عندك API منفصل
    navigate(screen);
  };
  
  const renderItem = (item) => {
    const today = new Date();
    const endDate = new Date(item.opportunity.end_date);
    const showCertificateButton = item.certificate && endDate < today;

    return (
      <div style={styles.card} key={item.id}>
        <div style={styles.header}>
          <span role="img" aria-label="briefcase" style={styles.icon}>💼</span>
          <h3 style={styles.title}>{item.opportunity.title}</h3>
        </div>
        <p style={styles.description}>{item.opportunity.description}</p>
        <p style={styles.date}>
          From <strong>{item.opportunity.start_date}</strong> to <strong>{item.opportunity.end_date}</strong>
        </p>
        <p style={styles.status}>Status: <span style={{textTransform: 'capitalize'}}>{item.status}</span></p>

        {item.can_evaluate && (
          <button
            style={{ ...styles.button, ...styles.evaluateButton }}
            onClick={() => navigate(`/EvaluateScreen/${item.id}`)}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4caf50'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#66bb6a'}
          >
            ⭐ Evaluate Opportunity
          </button>
        )}

        {showCertificateButton && (
          <button
            style={{ ...styles.button, ...styles.certificateButton }}
            onClick={() => downloadCertificate(item.id)}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2e7d32'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#388e3c'}
          >
            ⬇️ Download Certificate
          </button>
        )}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <OpportunityFilters
  initialFilter="Eval"
  onFilterSelect={handleFilterChange}
/>

      <h1 style={styles.screenTitle}>My Applications</h1>

      {loading ? (
        <div style={styles.loading}>Loading...</div>
      ) : (
        <>
          {applications.length === 0 ? (
            <p style={styles.noApplications}>No applications found.</p>
          ) : (
            <div style={styles.listContainer}>
              {applications.map(renderItem)}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#e8f5e9',
    padding: 24,
    minHeight: '100vh',
    fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: 24,
    textAlign: 'center',
  },
  loading: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginTop: 40,
  },
  noApplications: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
    marginTop: 40,
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    maxWidth: 800,
    margin: '0 auto',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease',
    cursor: 'default',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 28,
    color: '#388e3c',
    marginRight: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    margin: 0,
    color: '#1b5e20',
  },
  description: {
    fontSize: 15,
    color: '#444',
    marginBottom: 12,
    lineHeight: 1.4,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  status: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 16,
  },
  button: {
    padding: '12px 22px',
    borderRadius: 12,
    border: 'none',
    fontWeight: '600',
    fontSize: 16,
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  evaluateButton: {
    backgroundColor: '#66bb6a',
    color: 'white',
  },
  certificateButton: {
    backgroundColor: '#388e3c',
    color: 'white',
    marginTop: 12,
  },
};

export default ApplicationsScreen;
