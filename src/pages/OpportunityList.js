import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OpportunityList.css';
import Navbar from '../pages/Navbar';

const OpportunitiesList = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    start_date: '',
    end_date: '',
    max_participants: '',
    base_points: '',
    required_points: '',
  });

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) {
          setError('Token not found');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/opportunities/organization`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const updatedOpportunities = response.data.opportunities.map((op) => ({
          ...op,
          required_points: op.required_points || 0,
        }));

        setOpportunities(updatedOpportunities);
      } catch (e) {
        setError('Failed to load opportunities');
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setError('Token not found');
        return;
      }

      const response = await axios.delete(`http://localhost:5000/opportunities/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setOpportunities(opportunities.filter((op) => op.id !== id));
        alert('Opportunity deleted successfully');
      }
    } catch {
      setError('Failed to delete opportunity');
    }
  };

  const handleMorePress = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setModalType('details');
    setModalVisible(true);
  };

  const handleUpdatePress = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setFormData({
      title: opportunity.title,
      description: opportunity.description,
      location: opportunity.location,
      start_date: opportunity.start_date,
      end_date: opportunity.end_date,
      max_participants: opportunity.max_participants || '',
      base_points: opportunity.base_points || '',
      required_points: opportunity.required_points || '',
    });
    setModalType('update');
    setModalVisible(true);
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdateSubmit = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) return setError('Token not found');

      const id = selectedOpportunity.id;
      const isJob = selectedOpportunity.opportunity_type === 'Job';

      const payload = isJob
        ? {
            title: formData.title,
            description: formData.description,
            location: formData.location,
            start_date: formData.start_date,
            end_date: formData.end_date,
            required_points: parseInt(formData.required_points),
          }
        : {
            title: formData.title,
            description: formData.description,
            location: formData.location,
            start_date: formData.start_date,
            end_date: formData.end_date,
            max_participants: parseInt(formData.max_participants),
            base_points: parseInt(formData.base_points),
          };

      const response = await axios.put(
        `http://localhost:5000/opportunities/${id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert('Opportunity updated successfully');
        setModalVisible(false);
        setSelectedOpportunity(null);
        setModalType(null);

        // إعادة تحميل البيانات
        const refreshed = await axios.get(`http://localhost:5000/opportunities/organization`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOpportunities(refreshed.data.opportunities);
      }
    } catch {
      setError('Failed to update opportunity');
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedOpportunity(null);
    setModalType(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto', backgroundColor: '#ffffff' }}>
        <h2 style={{ textAlign: 'center', color: '#34c69a', marginBottom: '30px' }}>
          🌟 Available Opportunities
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {opportunities.map((opportunity) => (
            <div key={opportunity.id} style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
              padding: '20px',
              position: 'relative',
              border: '1px solid #e0e0e0',
              transition: 'transform 0.2s',
            }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {opportunity.image_url && (
                <div style={{
                  border: '2px solid #b9fbc0',
                  borderRadius: '10px',
                  padding: '6px',
                  marginBottom: '16px',
                }}>
                  <img src={opportunity.image_url} alt={opportunity.title} style={{
                    width: '100%', height: '200px', objectFit: 'cover', borderRadius: '6px'
                  }} />
                </div>
              )}

              <h3 style={{ color: '#057547', marginBottom: '12px' }}>📌 {opportunity.title}</h3>
              <p><b>Description:</b> {opportunity.description}</p>
              <p><b>Location:</b> {opportunity.location}</p>
              <p><b>Start:</b> {opportunity.start_date}</p>
              <p><b>End:</b> {opportunity.end_date}</p>
              <p><b>Type:</b> {opportunity.opportunity_type}</p>
              <p><b>Status:</b> {opportunity.status}</p>
              <p><b>Skills Required:</b>{' '}
                {opportunity.skills.map((skill, index) => (
                  <span key={skill.id}>💡 {skill.name}{index < opportunity.skills.length - 1 && ' / '}</span>
                ))}
              </p>

              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                <button onClick={() => handleMorePress(opportunity)} style={{
                  backgroundColor: '#b9fbc0', color: '#065f46', padding: '8px 16px',
                  border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
                }}>🔍 More Details</button>

                <button onClick={() => handleUpdatePress(opportunity)} style={{
                  backgroundColor: '#fbbf24', color: '#5a3800', padding: '8px 12px',
                  border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
                }}>✏️ Update</button>

                <button onClick={() => handleDelete(opportunity.id)} style={{
                  backgroundColor: '#f87171', color: 'white', padding: '8px 12px',
                  border: 'none', borderRadius: '8px', cursor: 'pointer'
                }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>

        {modalVisible && selectedOpportunity && modalType === 'update' && (
          <div onClick={closeModal} style={{
            position: 'fixed', top: 0, left: 0, height: '100vh', width: '100vw',
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
            alignItems: 'center', zIndex: 1000
          }}>
            <div onClick={(e) => e.stopPropagation()} style={{
              backgroundColor: '#fff', borderRadius: '12px', padding: '20px',
              width: '90%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto'
            }}>
              <h3 style={{ color: '#057547' }}>✏️ Update Opportunity</h3>

              <input name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} className="input" />
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} className="input" />
              <input name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} className="input" />
              <input name="start_date" type="date" value={formData.start_date} onChange={handleInputChange} className="input" />
              <input name="end_date" type="date" value={formData.end_date} onChange={handleInputChange} className="input" />

              {selectedOpportunity.opportunity_type === 'Job' ? (
                <input name="required_points" placeholder="Required Points" value={formData.required_points} onChange={handleInputChange} className="input" />
              ) : (
                <>
                  <input name="max_participants" placeholder="Max Participants" value={formData.max_participants} onChange={handleInputChange} className="input" />
                  <input name="base_points" placeholder="Base Points" value={formData.base_points} onChange={handleInputChange} className="input" />
                </>
              )}

              <div style={{ textAlign: 'right', marginTop: '10px' }}>
                <button onClick={handleUpdateSubmit} style={{
                  backgroundColor: '#34d399', padding: '10px 16px', border: 'none',
                  borderRadius: '6px', color: '#065f46', fontWeight: 'bold'
                }}>✅ Save</button>
              </div>
            </div>
          </div>
        )}

        {modalVisible && selectedOpportunity && modalType === 'details' && (
          <div onClick={closeModal} style={{
            position: 'fixed', top: 0, left: 0, height: '100vh', width: '100vw',
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
            alignItems: 'center', zIndex: 1000
          }}>
            <div onClick={(e) => e.stopPropagation()} style={{
              backgroundColor: '#fff', borderRadius: '12px', padding: '20px',
              width: '80%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto'
            }}>
              <h3 style={{ color: '#057547', marginBottom: '20px' }}>📋 Opportunity Details</h3>
              {Object.entries(selectedOpportunity).map(([key, value]) => {
                if (key === 'skills') return null;
                return (
                  <p key={key}>
                    <b>{key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}:</b> {String(value)}
                  </p>
                );
              })}
              <div style={{ textAlign: 'right' }}>
                <button onClick={closeModal} style={{
                  marginTop: '15px', backgroundColor: '#b9fbc0', color: '#065f46',
                  padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
                }}>✖ Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OpportunitiesList;
