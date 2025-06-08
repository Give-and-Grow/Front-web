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
  FaBook,
  FaIdCard,
  FaUpload
} from 'react-icons/fa';

import './ProfileOrganizationScreen.css';

const ProfileOrganizationScreen = () => {
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [token, setToken] = useState('');
  const navigate = useNavigate();
   const fileInputRef = useRef(null);
   const identityInputRef = useRef(null);

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
  const handleUploadIdentityPicture = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'my_unsigned_preset');  // ← غيّرها
  formData.append('cloud_name', 'dhrugparh');          // ← غيّرها
  try {
    setIsUploading(true);
    const res = await fetch('https://api.cloudinary.com/v1_1/dhrugparh/image/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setProfile((prev) => ({ ...prev, proof_image: data.secure_url }));

  } catch (err) {
    console.error('Upload failed:', err);
  } finally {
    setIsUploading(false);
  }
};

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
    setProfile((prev) => ({ ...prev, logo: imageUrl }));
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
 {profile.logo ? (
  <img src={profile.logo} alt="Profile" className="profileImage" />
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
{/* Left: Label with Icon */}
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <FaIdCard style={{ color: '#2e7d32', fontSize: '20px', marginRight: '8px' }} />
      <span style={{ fontSize: '14px', color: '#2e7d32' }}>Identity Picture</span>
    </div>

    {/* Right: Image OR Text + Upload Button */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {profile.proof_image ? (
        <a href={profile.proof_image} target="_blank" rel="noopener noreferrer">
          <img
            src={profile.proof_image}
            alt="Identity"
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '4px',
              objectFit: 'cover',
              border: '1px solid #ccc',
            }}
          />
        </a>
      ) : (
        <span style={{ color: '#999', fontSize: '13px' }}>No ID uploaded</span>
      )}

      {isEditing && (
        <>
          <button
            onClick={() => identityInputRef.current.click()}
            aria-label="Upload identity"
            style={{
              backgroundColor: '#e8f5e9',
              border: '1px solid #2e7d32',
              borderRadius: '4px',
              padding: '6px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FaUpload style={{ color: '#2e7d32' }} />
          </button>

          <input
            type="file"
            accept="image/*"
            onChange={handleUploadIdentityPicture}
            ref={identityInputRef}
            style={{ display: 'none' }}
          />
        </>
      )}

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
