import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import AsyncStorage from '@react-native-async-storage/async-storage'; // استخدم مكتبة تخزين مناسبة للويب لو لم تكن تستخدم React Native Web
import { useNavigate } from 'react-router-dom'; // لو تستخدم react-router-dom على الويب
import Navbar from '../pages/Navbar';  
import {
  FaEdit,
  FaSave,
  FaLock,
  FaTimesCircle,
  FaUser,
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaCity,
  FaHome,
  FaVenusMars,
  FaBirthdayCake,
  FaInfoCircle,
  FaBook
} from 'react-icons/fa';

import './ProfileOrganizationScreen.css';

const ProfileOrganizationScreen = () => {
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getToken = async () => {
      try {
        const savedToken = localStorage.getItem('userToken');
        if (savedToken) {
          setToken(savedToken);
          fetchProfile(savedToken);
        }
      } catch (err) {
        console.error('Error retrieving token:', err);
      }
    };

    getToken();
  }, []);

  const fetchProfile = async (token) => {
    try {
      const res = await axios.get(`http://localhost:5000/organization/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (err) {
      console.error('Fetch profile error:', err.response ? err.response.data : err.message);
      alert('Error fetching profile: ' + (err.response ? err.response.data : err.message));
    }
  };

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = async () => {
    const editableFields = [
      'name', 'description', 'phone', 'address', 'logo', 'proof_image'
    ];

    const cleanedProfile = {};
    editableFields.forEach((key) => {
      if (profile[key] !== undefined && profile[key] !== null) {
        cleanedProfile[key] = profile[key];
      }
    });

    try {
      const res = await axios.put(`http://localhost:5000/organization/profile`, cleanedProfile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsEditing(false);
    } catch (err) {
      if (err.response) {
        alert(JSON.stringify(err.response.data.errors || err.response.data.msg, null, 2));
      } else {
        console.error('Unknown error:', err.message);
      }
    }
  };

  return (
    <>
      <Navbar />
      <main className="container">
        {profile.logo && (
          <img src={profile.logo} alt="Organization Logo" className="profileImage" />
        )}

        <section className="card">
          <h3>Organization Information</h3>
          <div>
            <label>Organization Name</label>
            <div className="input-with-icon">
  <FaUserCircle className="input-icon" />
  <input
    type="text"
    value={profile.name || ''}
    onChange={(e) => handleChange('name', e.target.value)}
    disabled={!isEditing}
  />
</div>

            
          </div>
          <div>
            <label>Description</label>
            <div className="input-with-icon">
  <FaInfoCircle className="input-icon" />
  <textarea
    value={profile.description || ''}
    onChange={(e) => handleChange('description', e.target.value)}
    disabled={!isEditing}
  />
</div>

          </div>
          <div>
            <label>Phone</label>
            <div className="input-with-icon">
  <FaPhone className="input-icon" />
  <input
    type="text"
    value={profile.phone || ''}
    onChange={(e) => handleChange('phone', e.target.value)}
    disabled={!isEditing}
  />
</div>

          </div>
          <div>
            <label>Address</label>
            <div className="input-with-icon">
  <FaHome className="input-icon" />
  <input
    type="text"
    value={profile.address || ''}
    onChange={(e) => handleChange('address', e.target.value)}
    disabled={!isEditing}
  />
</div>

          </div>
        </section>

        {profile.proof_image && (
          <section className="card">
            <h3>Proof Image</h3>
            <img src={profile.proof_image} alt="Proof" className="profileImage" />
          </section>
        )}

        <div className="buttonGroup">
          <button
            className="actionButton"
            onClick={() => setIsEditing(!isEditing)}
            style={{ backgroundColor: '#4d6642', color: 'white', padding: '10px' }}
          >
            {isEditing ? (
              <>
                <FaTimesCircle /> Cancel Editing
              </>
            ) : (
              <>
                <FaEdit /> Edit Profile
              </>
            )}
          </button>

          {isEditing && (
            <button
              className="actionButton"
              style={{ backgroundColor: '#4d6642', color: 'white', padding: '10px' }}
              onClick={handleSave}
            >
              <FaSave /> Save Changes
            </button>
          )}

          <button
            className="actionButton"
            style={{ backgroundColor: '#4d6642', color: 'white', padding: '10px' }}
            onClick={() => navigate('/change-password-profile')}
          >
            <FaLock /> Update Password
          </button>
        </div>
      </main>
    </>
  );
};

export default ProfileOrganizationScreen;
