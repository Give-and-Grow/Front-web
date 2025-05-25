import React, { useEffect, useState } from 'react';
import { FaBriefcase, FaCalendarAlt, FaUsers, FaSave, FaTimes } from 'react-icons/fa';
import Navbar from '../pages/Navbar';  // عدل المسار حسب مكان ملف Navbar.js
import { useNavigate } from 'react-router-dom';
const AttendanceScreen = () => {
    const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState('');
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState('attendance');
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
    if (!selectedOpportunity) {
      setDates([]);
      setSelectedDate('');
      setParticipants([]);
      return;
    }
    fetchDates(selectedOpportunity);
  }, [selectedOpportunity]);

  const fetchDates = async (opportunityId) => {
    try {
      const res = await fetch(`http://localhost:5000/attendance/${opportunityId}/dates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setDates(data.dates || []);
      setSelectedDate('');
      setParticipants([]);
    } catch {
      alert('Failed to fetch dates');
    }
  };

  const fetchParticipants = async () => {
    if (!selectedDate || !selectedOpportunity) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/attendance/${selectedOpportunity}?date=${selectedDate}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setParticipants(data.participants || []);
      setModalVisible(true);
    } catch {
      alert('Failed to fetch participants');
    }
    setLoading(false);
  };

  const toggleAttendance = (participant_id) => {
    setParticipants(prev =>
      prev.map(p =>
        p.participant_id === participant_id
          ? { ...p, status: p.status === 'present' ? 'absent' : 'present' }
          : p
      )
    );
  };

  const saveAttendance = async () => {
    if (!selectedDate || !selectedOpportunity) return;
    setLoading(true);

    const attendanceData = participants.map(p => ({
      participant_id: p.participant_id,
      status: p.status,
      date: selectedDate
    }));

    try {
      const res = await fetch(`http://localhost:5000/attendance/${selectedOpportunity}?date=${selectedDate}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(attendanceData)
      });
      const data = await res.json();
      alert(data.message || 'Attendance saved');
      setModalVisible(false);
    } catch (error) {
      alert('Failed to save attendance');
    }
    setLoading(false);
  };


  // handle focus style for selects (for nice effect)
  const [selectFocused, setSelectFocused] = useState({ opportunity: false, date: false });

  return (
    <>
    <Navbar />
    <div style={styles.container}>
      
          <div style={styles.card}>
      <h2 style={styles.heading}>📋 Attendance Tracker</h2>

      <label style={styles.label}>
        <FaBriefcase style={{ marginRight: 8 }} /> Select Opportunity:
      </label>
      <select
        value={selectedOpportunity}
        onChange={e => setSelectedOpportunity(e.target.value)}
        onFocus={() => setSelectFocused(prev => ({ ...prev, opportunity: true }))}
        onBlur={() => setSelectFocused(prev => ({ ...prev, opportunity: false }))}
        style={{
          ...styles.select,
          ...(selectFocused.opportunity ? styles.selectFocus : {})
        }}
      >
        <option value="">Choose opportunity</option>
        {opportunities.map(o => (
          <option key={o.id} value={o.id}>
            {o.title}
          </option>
        ))}
      </select>

      {dates.length > 0 && (
        <>
          <label style={styles.label}>
            <FaCalendarAlt style={{ marginRight: 8 }} /> Select Date:
          </label>
          <select
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            onFocus={() => setSelectFocused(prev => ({ ...prev, date: true }))}
            onBlur={() => setSelectFocused(prev => ({ ...prev, date: false }))}
            style={{
              ...styles.select,
              ...(selectFocused.date ? styles.selectFocus : {})
            }}
          >
            <option value="">Choose date</option>
            {dates.map(d => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </>
      )}

      <button
        style={{
          ...styles.button,
          ...((!selectedDate || !selectedOpportunity || loading) && styles.buttonDisabled)
        }}
        disabled={!selectedDate || !selectedOpportunity || loading}
        onClick={fetchParticipants}
      >
        <FaUsers /> Show Participants
      </button>

      {modalVisible && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalHeading}>
              <FaUsers style={{ marginRight: 8 }} /> Participants
            </h3>

            {loading ? (
              <div style={{ textAlign: 'center', color: '#2a6b2a', fontWeight: '600' }}>Loading...</div>
            ) : (
              participants.map(item => (
                <div
                  key={item.participant_id}
                  onClick={() => toggleAttendance(item.participant_id)}
                  style={styles.participantItem(item.status)}
                  title="Click to toggle attendance"
                >
                  <span>{item.name}</span>
                  <span>{item.status === 'present' ? '✔️ Present' : '✘ Absent'}</span>
                </div>
              ))
            )}

            <div style={styles.modalButtonsContainer}>
              <button
                style={styles.saveButton}
                onClick={saveAttendance}
                disabled={loading}
              >
                <FaSave /> Save Attendance
              </button>
              <button
                style={styles.closeButton}
                onClick={() => setModalVisible(false)}
              >
                <FaTimes /> Close
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

export default AttendanceScreen;

  // تدرجات أخضر - ستايل عام
  const styles = {
    container: {
      padding: 25,
      backgroundColor: '#e6f2e6', // أخضر فاتح جداً
      minHeight: '100vh',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    heading: {
      textAlign: 'center',
      color: '#2a6b2a', // أخضر متوسط
      fontWeight: '700',
      fontSize: 28,
      marginBottom: 30,
      letterSpacing: '1.5px',
      textShadow: '1px 1px 2px #b2d8b2'
    },
    label: {
      fontWeight: '600',
      color: '#2a6b2a',
      marginBottom: 8,
      display: 'block',
      fontSize: 16,
      textTransform: 'uppercase',
      letterSpacing: '0.1em'
    },
    select: {
      width: '100%',
      padding: '12px 15px',
      borderRadius: 12,
      border: '2px solid #4caf50', // أخضر زاهي
      backgroundColor: '#f0fff0', // أخضر فاتح جداً جداً
      fontSize: 16,
      color: '#2a6b2a',
      boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: 'border-color 0.3s ease',
      outline: 'none',
      cursor: 'pointer',
      marginBottom: 20,
    },
    selectFocus: {
      borderColor: '#388e3c', // أخضر داكن عند التركيز
      boxShadow: '0 0 8px #a5d6a7',
    },
    button: {
      marginTop: 15,
      backgroundColor: '#4caf50',
      color: '#fff',
      padding: '12px 20px',
      border: 'none',
      borderRadius: 15,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      fontSize: 18,
      fontWeight: '600',
      boxShadow: '0 5px 15px rgba(76, 175, 80, 0.4)',
      transition: 'background-color 0.3s ease',
    },
    buttonDisabled: {
      backgroundColor: '#a5d6a7',
      cursor: 'not-allowed',
      boxShadow: 'none',
    },
  modalOverlay: {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)', // ظل رمادي شفاف بدلاً من الأخضر
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
  zIndex: 1000
},

    modalContent: {
      backgroundColor: '#dcedc8', // أخضر فاتح للنافذة
      borderRadius: 20,
      padding: 30,
      maxHeight: '80vh',
      overflowY: 'auto',
      width: '90%',
      maxWidth: 650,
      boxShadow: '0 8px 20px rgba(42, 107, 42, 0.5)'
    },
    modalHeading: {
      textAlign: 'center',
      color: '#2e7d32',
      marginBottom: 20,
      fontWeight: '700',
      fontSize: 24,
      textShadow: '1px 1px 3px #a5d6a7',
    },
    participantItem: (status) => ({
      padding: 18,
      marginBottom: 12,
      borderRadius: 15,
      backgroundColor: status === 'present' ? '#81c784' : '#ffcdd2',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontWeight: '600',
      color: status === 'present' ? '#1b5e20' : '#b71c1c',
      boxShadow: status === 'present'
        ? '0 3px 10px rgba(129, 199, 132, 0.7)'
        : '0 3px 10px rgba(255, 205, 210, 0.7)',
      transition: 'background-color 0.3s ease, color 0.3s ease',
      userSelect: 'none',
    }),
    modalButtonsContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    saveButton: {
      backgroundColor: '#388e3c',
      color: '#fff',
      padding: '12px 20px',
      border: 'none',
      borderRadius: 15,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontSize: 16,
      fontWeight: '700',
      boxShadow: '0 4px 12px rgba(56, 142, 60, 0.6)',
      transition: 'background-color 0.3s ease',
    },
    closeButton: {
      backgroundColor: '#7cb342',
      color: '#fff',
      padding: '12px 20px',
      border: 'none',
      borderRadius: 15,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontSize: 16,
      fontWeight: '700',
      boxShadow: '0 4px 12px rgba(124, 179, 66, 0.6)',
      transition: 'background-color 0.3s ease',
    },
     card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    maxWidth: 700,
    margin: '0 auto',
  },
  };