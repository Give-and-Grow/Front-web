import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';



const OpportunitiesList = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('list');
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [filter, setFilter] = useState("list_all");
  const [updateData, setUpdateData] = useState({
    title: '',
    description: '',
    location: '',
    start_date: '',
    end_date: '',
    required_points: '',
    max_participants: '',
    base_points: '',
  });

  // لاحظ: في React ويب ما في AsyncStorage، نستخدم localStorage
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
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const updatedOpportunities = response.data.opportunities.map(opportunity => ({
          ...opportunity,
          required_points: opportunity.required_points || 0,
        }));

        setOpportunities(updatedOpportunities);
      } catch (error) {
        setError('Failed to load opportunities');
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const handleRestore = async (opportunityId) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setError('Token not found');
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/opportunities/${opportunityId}/restore`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert('Opportunity restored successfully');
        // تحديث الحالة أو إعادة التحميل حسب الحاجة
      }
    } catch (error) {
      setError('Failed to restore opportunity');
    }
  };

  const handleDelete = async (opportunityId) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setError('Token not found');
        return;
      }

      const response = await axios.delete(`http://localhost:5000/opportunities/${opportunityId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setOpportunities(opportunities.filter(op => op.id !== opportunityId));
        alert('Opportunity deleted successfully');
      }
    } catch (error) {
      setError('Failed to delete opportunity');
    }
  };

  const handleSubmitUpdate = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setError('Token not found');
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/opportunities/${selectedOpportunity.id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedOpportunities = opportunities.map(op =>
          op.id === selectedOpportunity.id ? { ...op, ...updateData } : op
        );
        setOpportunities(updatedOpportunities);
        alert('Opportunity updated successfully');
        closeModal();
      }
    } catch (error) {
      setError('Failed to update opportunity');
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedOpportunity(null);
    setModalType(null);
  };

  const handleMorePress = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setModalType('details');
    setModalVisible(true);
  };

  const handleUpdate = (opportunity) => {
    if (opportunity.opportunity_type === 'OpportunityType.JOB') {
      setSelectedOpportunity(opportunity);
      setUpdateData({
        title: opportunity.title,
        description: opportunity.description,
        location: opportunity.location,
        start_date: opportunity.start_date,
        end_date: opportunity.end_date,
        required_points: opportunity.required_points ? opportunity.required_points.toString() : '',
      });
      setModalType('update');
      setModalVisible(true);
    } else if (opportunity.opportunity_type === 'OpportunityType.VOLUNTEER') {
      setSelectedOpportunity(opportunity);
      setUpdateData({
        title: opportunity.title,
        description: opportunity.description,
        location: opportunity.location,
        start_date: opportunity.start_date,
        end_date: opportunity.end_date,
        max_participants: opportunity.max_participants ? opportunity.max_participants.toString() : '',
        base_points: opportunity.base_points ? opportunity.base_points.toString() : '',
      });
      setModalType('update');
      setModalVisible(true);
    } else {
      alert('This opportunity cannot be updated.');
    }
  };

  const formatKey = (key) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Available Opportunities</h2>

      {opportunities.map(opportunity => (
        <div key={opportunity.id} style={{ border: '1px solid #ddd', marginBottom: 20, padding: 10, borderRadius: 5 }}>
          {opportunity.image_url && (
            <img src={opportunity.image_url} alt={opportunity.title} style={{ maxWidth: '100%', height: 'auto' }} />
          )}

          <div style={{ marginTop: 10, marginBottom: 10 }}>
            {opportunity.is_deleted === false ? (
              <button onClick={() => handleDelete(opportunity.id)} style={{ marginRight: 10 }}>🗑️ Delete</button>
            ) : (
              <button onClick={() => handleRestore(opportunity.id)} style={{ marginRight: 10 }}>↩️ Restore</button>
            )}
            <button onClick={() => handleUpdate(opportunity)}>✏️ Update</button>
          </div>

          <h3>{opportunity.title}</h3>
          <p>{opportunity.description}</p>
          <p><strong>Location:</strong> {opportunity.location}</p>
          <p><strong>Start Date:</strong> {opportunity.start_date}</p>
          <p><strong>End Date:</strong> {opportunity.end_date}</p>
          <p><strong>Opportunity Type:</strong> {opportunity.opportunity_type}</p>
          <p><strong>Status:</strong> {opportunity.status}</p>

          <button onClick={() => handleMorePress(opportunity)}>More Details</button>
        </div>
      ))}

      {/* مودال التحديث */}
      <Modal isOpen={modalVisible && modalType === 'update'} onRequestClose={closeModal} ariaHideApp={false}>
        <h2>Update Opportunity</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmitUpdate(); }}>
          <input
            type="text"
            placeholder="Title"
            value={updateData.title}
            onChange={(e) => setUpdateData({ ...updateData, title: e.target.value })}
            required
          />
          <br />
          <textarea
            placeholder="Description"
            value={updateData.description}
            onChange={(e) => setUpdateData({ ...updateData, description: e.target.value })}
            required
          />
          <br />
          <input
            type="text"
            placeholder="Location"
            value={updateData.location}
            onChange={(e) => setUpdateData({ ...updateData, location: e.target.value })}
            required
          />
          <br />
          <input
            type="date"
            placeholder="Start Date"
            value={updateData.start_date}
            onChange={(e) => setUpdateData({ ...updateData, start_date: e.target.value })}
            required
          />
          <br />
          <input
            type="date"
            placeholder="End Date"
            value={updateData.end_date}
            onChange={(e) => setUpdateData({ ...updateData, end_date: e.target.value })}
            required
          />
          <br />

          {selectedOpportunity && selectedOpportunity.opportunity_type === 'OpportunityType.JOB' && (
            <>
              <input
                type="number"
                placeholder="Required Points"
                value={updateData.required_points}
                onChange={(e) => setUpdateData({ ...updateData, required_points: e.target.value })}
                required
              />
              <br />
            </>
          )}

          {selectedOpportunity && selectedOpportunity.opportunity_type === 'OpportunityType.VOLUNTEER' && (
            <>
              <input
                type="number"
                placeholder="Max Participants"
                value={updateData.max_participants}
                onChange={(e) => setUpdateData({ ...updateData, max_participants: e.target.value })}
                required
              />
              <br />
              <input
                type="number"
                placeholder="Base Points"
                value={updateData.base_points}
                onChange={(e) => setUpdateData({ ...updateData, base_points: e.target.value })}
                required
              />
              <br />
            </>
          )}

          <button type="submit">Save</button>
          <button type="button" onClick={closeModal}>Cancel</button>
        </form>
      </Modal>

      {/* مودال التفاصيل */}
      <Modal isOpen={modalVisible && modalType === 'details'} onRequestClose={closeModal} ariaHideApp={false}>
        <h2>Opportunity Details</h2>
        {selectedOpportunity && (
          <div>
            {Object.entries(selectedOpportunity).map(([key, value]) => (
              <p key={key}><strong>{formatKey(key)}:</strong> {value ? value.toString() : 'N/A'}</p>
            ))}
          </div>
        )}
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default OpportunitiesList;

