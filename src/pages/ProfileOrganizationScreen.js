import React, { useEffect, useState, useRef} from 'react';
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
   const fileInputRef = useRef(null);
const [isUploading, setIsUploading] = useState(false);
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
const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'my_unsigned_preset');  // ← غيّرها
  formData.append('cloud_name', 'dhrugparh');          // ← غيّرها

  try {
    setIsUploading(true); // ← تشغيل اللودر
    const res = await axios.post('https://api.cloudinary.com/v1_1/dhrugparh/image/upload', formData);
    const imageUrl = res.data.secure_url;
    setProfile((prev) => ({ ...prev, proof_image: imageUrl }));
  } catch (err) {
    console.error('Error uploading image:', err);
    alert('Failed to upload image');
  } finally {
    setIsUploading(false); // ← إيقاف اللودر
  }
};
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
    <div className="profile-picture-section">
 {profile.proof_image ? (
  <img src={profile.proof_image} alt="Profile" className="profileImage" />
) : (
  <img
    src="/logo.png" // <-- غيّر المسار حسب مكان الشعار في مشروعك
    alt="Default Logo"
    className="profileImage"
    onClick={isEditing ? () => fileInputRef.current.click() : undefined}
    title={isEditing ? "Click to upload image" : ""}
    style={{ cursor: isEditing ? 'pointer' : 'default' }}
  />
)}


  {isEditing && (
    <>
      <button
        className="edit-icon-button"
        onClick={() => fileInputRef.current.click()}
        aria-label="Edit profile picture"
      >
        ✎
      </button>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />

      {isUploading && <div className="loader"></div>}
    </>
  )}
</div>


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
