// OpportunitiesList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OpportunityList.css';
import { FaMapMarkerAlt, FaInfoCircle, FaEye, FaTrashAlt } from 'react-icons/fa';
import Navbar from './Navbar';  // عدل المسار حسب مكان ملف Navbar.js
const OpportunitiesList = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [filters, setFilters] = useState({ location: '', status: '' });
  const [showDeleted, setShowDeleted] = useState(false);

  // حقول التحديث
  const [updatedData, setUpdatedData] = useState({
    title: '',
    description: '',
    location: '',
    start_date: '',
    end_date: '',
    status: ''
  });

 useEffect(() => {
  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      if (!token) {
        setError('Token not found');
        setLoading(false);
        return;
      }

      const response = await axios.get(`http://localhost:5000/opportunities/organization?is_deleted=${showDeleted}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('showDeleted:', showDeleted);
      console.log('Raw opportunities from API:', response.data.opportunities);

      const updated = response.data.opportunities.map(o => ({
        ...o,
        required_points: o.required_points || 0,
      }));

      setOpportunities(updated);
    } catch (err) {
      setError('Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  fetchOpportunities();
}, [showDeleted]);



  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`http://localhost:5000/opportunities/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOpportunities(prev => prev.filter(o => o.id !== id));
      alert('Deleted successfully');
    } catch {
      setError('Failed to delete opportunity');
    }
  };

  const handleMorePress = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setModalType('details');
    setModalVisible(true);
  };

  const handleEdit = (opportunity) => {
  setSelectedOpportunity(opportunity);
  const commonFields = {
    title: opportunity.title,
    description: opportunity.description,
    location: opportunity.location,
    start_date: opportunity.start_date,
    end_date: opportunity.end_date,
  };

  if (opportunity.opportunity_type === 'volunteer') {
    setUpdatedData({
      ...commonFields,
      max_participants: opportunity.max_participants || '',
      base_points: opportunity.base_points || ''
    });
  } else if (opportunity.opportunity_type === 'job') {
    setUpdatedData({
      ...commonFields,
      required_points: opportunity.required_points || ''
    });
  }

  setModalType('edit');
  setModalVisible(true);
};


 const handleUpdate = async () => {
  try {
    const token = localStorage.getItem('userToken');
    const type = selectedOpportunity.opportunity_type;

    const allowedFields =
      type === 'volunteer'
        ? ['title', 'description', 'location', 'start_date', 'end_date', 'max_participants', 'base_points']
        : ['title', 'description', 'location', 'start_date', 'end_date', 'required_points'];

    const filteredData = {};
    for (const key of allowedFields) {
      if (updatedData[key] !== undefined) {
        filteredData[key] = updatedData[key];
      }
    }

    await axios.put(`http://localhost:5000/opportunities/${selectedOpportunity.id}`, filteredData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setOpportunities(prev =>
      prev.map(o => o.id === selectedOpportunity.id ? { ...o, ...filteredData } : o)
    );

    closeModal();
    alert('Updated successfully');
  } catch (err) {
    alert('Update failed');
  }
};

const handleRestore = async (id) => {
  try {
    const token = localStorage.getItem('userToken');
    await axios.put(`http://localhost:5000/opportunities/${id}/restore`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setOpportunities(prev =>
      prev.map(o => o.id === id ? { ...o, is_deleted: false } : o)
    );

    alert('Opportunity restored successfully');
  } catch (err) {
    setError('Failed to restore opportunity');
  }
};

  const closeModal = () => {
    setModalVisible(false);
    setSelectedOpportunity(null);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredOpportunities = opportunities.filter(o =>
    o.location.toLowerCase().includes(filters.location.toLowerCase()) &&
    o.status.toLowerCase().includes(filters.status.toLowerCase())
  );

  if (loading) return <div className="loading-spinner" aria-label="Loading"></div>;

  if (error) return <div className="error">{error}</div>;

  return (
    <>
  
    <Navbar />
    <div className="container">
      <h2 className="title">Available Opportunities</h2>
<button className="toggle-btn" onClick={() => setShowDeleted(!showDeleted)}>
  {showDeleted ? (
    <>
      <FaEye /> Show Active Opportunities
    </>
  ) : (
    <>
      <FaTrashAlt /> Show Deleted Opportunities
    </>
  )}
</button>

{/* الفلاتر */}
<div className="filters">
  <div className="filter-input">
    <FaMapMarkerAlt />
    <input
      type="text"
      name="location"
      placeholder="Filter by location"
      value={filters.location}
      onChange={handleFilterChange}
    />
  </div>

  <div className="filter-input">
    <FaInfoCircle />
    <input
      type="text"
      name="status"
      placeholder="Filter by status"
      value={filters.status}
      onChange={handleFilterChange}
    />
  </div>
</div>

      <div className="cards">
        {filteredOpportunities.map(op => (
          <div key={op.id} className="card">
            {op.image_url && <img src={op.image_url} alt="opportunity" className="card-image" />}
           <div className="card-content">
  <h3>{op.title}</h3>
  <p>{op.description}</p>
  <p><strong>Location:</strong> {op.location}</p>
  <p><strong>Start Date:</strong> {op.start_date}</p>
  <p><strong>End Date:</strong> {op.end_date}</p>
  <p><strong>Status:</strong> {op.status}</p>

  {/* skills section */}
  {op.skills && op.skills.length > 0 && (
  <div className="skills-container">
    <p className="skills-title">🛠️ Skills Required:</p>
    {op.skills.map((skill) => (
      <span key={skill.id} className="skill-badge">
        💡 {skill.name}
      </span>
    ))}
  </div>
)}


 <div className="buttons">
  <button className="btn details" onClick={() => handleMorePress(op)}>Details</button>
  <button className="btn update" onClick={() => handleEdit(op)}>Edit</button>
  
  {op.is_deleted ? (
    <button className="btn restore" onClick={() => handleRestore(op.id)}>Restore</button>
  ) : (
    <button className="btn delete" onClick={() => handleDelete(op.id)}>Delete</button>
  )}
</div>

</div>

          </div>
        ))}
      </div>

      {/* مودال التفاصيل أو التعديل */}
      {modalVisible && selectedOpportunity && (
        <div className="modal">
          <div className="modal-content">
            {modalType === 'details' ? (
              <>
                <h3>Opportunity Details</h3>
                {Object.entries(selectedOpportunity).map(([key, value]) => (
  key !== 'skills' && (
    <p key={key}><strong>{key.replace(/_/g, ' ')}:</strong> {String(value)}</p>
  )
))}

                <button className="btn close" onClick={closeModal}>Close</button>
              </>
            ) : (
              <>
                <h3>Edit Opportunity</h3>
               {Object.keys(updatedData).map(key => (
  <div key={key}>
    <label>{key.replace(/_/g, ' ')}:</label>
    <input
      type="text"
      value={updatedData[key]}
      onChange={e => setUpdatedData({ ...updatedData, [key]: e.target.value })}
    />
  </div>
))}

                <button className="btn update" onClick={handleUpdate}>Update</button>
                <button className="btn close" onClick={closeModal}>Cancel</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
     </>
  );
 
  
 
};

export default OpportunitiesList;
