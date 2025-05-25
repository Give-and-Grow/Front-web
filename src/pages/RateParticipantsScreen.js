import React, { useEffect, useState } from 'react';
import { FaBriefcase, FaCalendarAlt, FaStar, FaRegStar, FaSave, FaTimes, FaSearch } from 'react-icons/fa';
import './RateParticipantsScreen.css';
import Navbar from '../pages/Navbar';  // عدل المسار حسب مكان ملف Navbar.js

import { useNavigate } from 'react-router-dom';
const RateParticipantsScreen = () => {
   const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState('evaluate');
  useEffect(() => {
    const storedToken = localStorage.getItem('userToken');
    if (storedToken) {
      setToken(storedToken);
      fetchOpportunities(storedToken);
    }
  }, []);
 const handleFilterChange = (value, screen) => {
    console.log('Filter selected:', value, screen);
    setFilter(value);
    // ممكن هنا تجيب بيانات جديدة بحسب الفلتر لو عندك API منفصل
    navigate(screen);
  };
  const fetchOpportunities = async (authToken) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/opportunities/organization`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      setOpportunities(data.opportunities || []);
    } catch {
      alert('Failed to fetch opportunities');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!selectedOpportunity) return;
    setDates([]);
    setSelectedDate(null);
    setParticipants([]);
    fetchDates(selectedOpportunity.id);
  }, [selectedOpportunity]);

  const fetchDates = async (opportunityId) => {
    try {
      const res = await fetch(`http://localhost:5000/attendance/${opportunityId}/dates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setDates(data.dates || []);
    } catch {
      alert('Failed to fetch dates');
    }
  };

  const fetchEvaluations = async () => {
    if (!selectedDate || !selectedOpportunity) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/evaluation/${selectedOpportunity.id}?date=${selectedDate}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const withEvaluationFields = data.participants.map(p => ({
        ...p,
        score: p.score === -1 ? 0 : p.score,
        notes: p.notes || ''
      }));
      setParticipants(withEvaluationFields);
      setModalVisible(true);
    } catch {
      alert('Failed to fetch evaluations');
    }
    setLoading(false);
  };

  const handleRatingChange = (id, score) => {
    setParticipants(prev =>
      prev.map(p =>
        p.participant_id === id ? { ...p, score } : p
      )
    );
  };

  const handleNoteChange = (id, notes) => {
    setParticipants(prev =>
      prev.map(p =>
        p.participant_id === id ? { ...p, notes } : p
      )
    );
  };

  const saveEvaluations = async () => {
    if (!selectedDate || !selectedOpportunity) return;
    setLoading(true);

    const evaluationsPayload = participants.map(({ participant_id, score, notes }) => ({
      participant_id,
      score,
      notes,
      date: selectedDate
    }));

    try {
      const res = await fetch(`http://localhost:5000/evaluation/${selectedOpportunity.id}?date=${selectedDate}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(evaluationsPayload),
      });
      const data = await res.json();

      alert(data.message || 'Evaluations saved');
      setModalVisible(false);
    } catch (error) {
      alert('Failed to save evaluations');
    }
    setLoading(false);
  };

return (
  <>
    <Navbar />
    <div className="container">
      
      <div className="card">
        <h1 className="page-title">🌟 Participant Evaluation</h1>

        <label className="label">
          <FaBriefcase /> Select Opportunity:
        </label>
        <select
          className="select"
          value={selectedOpportunity?.id || ''}
          onChange={e => {
            const opp = opportunities.find(o => o.id.toString() === e.target.value);
            setSelectedOpportunity(opp || null);
          }}
        >
          <option value="">Choose opportunity</option>
          {opportunities.map(opp => (
            <option key={opp.id} value={opp.id}>{opp.title}</option>
          ))}
        </select>

        {dates.length > 0 && (
          <>
            <label className="label">
              <FaCalendarAlt /> Select Date:
            </label>
            <select
              className="select"
              value={selectedDate || ''}
              onChange={e => setSelectedDate(e.target.value)}
            >
              <option value="">Choose date</option>
              {dates.map(date => (
                <option key={date} value={date}>{date}</option>
              ))}
            </select>
          </>
        )}

        <button
          className={`btn btn-primary ${(!selectedDate || !selectedOpportunity) ? 'btn-disabled' : ''}`}
          onClick={fetchEvaluations}
          disabled={!selectedDate || !selectedOpportunity}
          onMouseEnter={e => {
            if (selectedDate && selectedOpportunity) e.currentTarget.classList.add('btn-primary-hover');
          }}
          onMouseLeave={e => {
            e.currentTarget.classList.remove('btn-primary-hover');
          }}
        >
          <FaSearch /> Show Participants
        </button>

        {/* Modal */}
        {modalVisible && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">
                <FaStar /> Evaluate Participants
              </h2>

              {loading ? (
                <div className="loading-text">Loading...</div>
              ) : (
                <div>
                  {participants.map(item => (
                    <div key={item.participant_id} className="participant-card">
                      <img
                        src={item.profile_picture}
                        alt={item.name}
                        className="participant-image"
                      />
                      <div className="participant-info">
                        <p className="participant-name">{item.name}</p>

                        <textarea
                          placeholder="Write notes..."
                          value={item.notes}
                          onChange={e => handleNoteChange(item.participant_id, e.target.value)}
                          className="participant-notes"
                          rows={3}
                        />

                        <div className="rating-stars">
                          {[1, 2, 3, 4, 5].map(n => (
                            <button
                              key={n}
                              onClick={() => handleRatingChange(item.participant_id, n)}
                              className={`star-btn ${item.score >= n ? 'star-filled' : 'star-empty'}`}
                              aria-label={`${n} star`}
                            >
                              {item.score >= n ? <FaStar /> : <FaRegStar />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="modal-buttons">
                <button
                  onClick={() => setModalVisible(false)}
                  className="btn btn-secondary"
                >
                  <FaTimes /> Close
                </button>
                <button
                  onClick={saveEvaluations}
                  disabled={loading}
                  className="btn btn-primary"
                >
                  <FaSave /> Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </>
);

};

export default RateParticipantsScreen;
