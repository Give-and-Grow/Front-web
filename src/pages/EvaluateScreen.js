import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // React Router
import axios from 'axios';
import { MdStar, MdStarOutline, MdCheckCircleOutline, MdArrowBack } from 'react-icons/md';


const EvaluateScreen = () => {
  const { participantId } = useParams(); // assuming participantId comes from URL params
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [token, setToken] = useState('');
  const [loadingToken, setLoadingToken] = useState(true);

  useEffect(() => {
    const loadToken = () => {
      try {
        const storedToken = localStorage.getItem('userToken');
        if (!storedToken) {
          alert('Please log in first.');
          navigate(-1);
          return;
        }
        setToken(storedToken);
      } catch (error) {
        alert('Failed to load user data.');
        navigate(-1);
      } finally {
        setLoadingToken(false);
      }
    };
    loadToken();
  }, [navigate]);

  const handleRating = (value) => setRating(value);

  const submitEvaluation = async () => {
    if (rating < 1 || rating > 5) {
      alert('Please select a rating between 1 and 5.');
      return;
    }
    if (!token) {
      alert('User data not loaded yet.');
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(
        `http://localhost:5000/user-participation/evaluate`,
        {
          participant_id: participantId,
          rating,
          feedback,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Thank you! Your evaluation was submitted successfully.');
      navigate(-1);
    } catch (error) {
      console.error('Evaluation Error:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        alert('Session expired or invalid token.');
      } else {
        alert(error.response?.data?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingToken) {
    return (
      <div style={styles.center}>
        <div className="spinner" style={{ fontSize: 48, color: '#4caf50' }}>⏳</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Volunteer Opportunity Evaluation</h1>

      <label style={styles.label}>Your Rating</label>
      <div style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((val) => (
          <button
            key={val}
            type="button"
            onClick={() => handleRating(val)}
            disabled={submitting}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              margin: '0 6px',
              padding: 0,
              outline: 'none',
            }}
            aria-label={`Rate ${val} star${val > 1 ? 's' : ''}`}
          >
            {val <= rating ? (
              <MdStar size={36} color="#4caf50" />
            ) : (
              <MdStarOutline size={36} color="#4caf50" />
            )}
          </button>
        ))}
      </div>

      <label htmlFor="feedback" style={styles.label}>Your Feedback</label>
      <textarea
        id="feedback"
        rows={5}
        placeholder="Write your feedback about this volunteer opportunity..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        disabled={submitting}
        style={styles.textArea}
      />

      <button
        type="button"
        onClick={submitEvaluation}
        disabled={submitting}
        style={{ 
          ...styles.submitButton, 
          ...(submitting ? styles.buttonDisabled : {}) 
        }}
      >
        {submitting ? 'Submitting...' : 'Submit Evaluation'} <MdCheckCircleOutline size={22} color="#fff" style={{ marginLeft: 8 }} />
      </button>

      <button
        type="button"
        onClick={() => navigate(`/ApplicationsScreen`)}
        style={styles.backButton}
      >
        <MdArrowBack size={28} color="#4caf50" />
        <span style={styles.backText}>Back</span>
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 600,
    margin: '40px auto',
    backgroundColor: '#e8f5e9',
    padding: 30,
    borderRadius: 16,
    boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  center: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 48,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: 28,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    color: '#388e3c',
    marginBottom: 8,
    fontWeight: '600',
    display: 'block',
  },
  starsContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 24,
  },
  textArea: {
    width: '100%',
    borderRadius: 16,
    padding: 14,
    fontSize: 16,
    color: '#333',
    border: '1px solid #a5d6a7',
    resize: 'vertical',
    marginBottom: 32,
    fontFamily: 'inherit',
  },
  submitButton: {
    backgroundColor: '#4caf50',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px',
    borderRadius: 16,
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    cursor: 'pointer',
    border: 'none',
    width: '100%',
    boxShadow: '0 3px 10px rgba(56, 142, 60, 0.3)',
    transition: 'background-color 0.3s ease',
  },
  buttonDisabled: {
    backgroundColor: '#a5d6a7',
    cursor: 'not-allowed',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 26,
    gap: 8,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: 18,
    color: '#4caf50',
    padding: 0,
  },
  backText: {
    fontSize: 18,
    color: '#4caf50',
  },
};

export default EvaluateScreen;
