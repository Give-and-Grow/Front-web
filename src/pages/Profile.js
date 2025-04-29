import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaSave, FaLock, FaUser, FaUserCircle, FaEnvelope, FaPhone, FaCity, FaHome, FaVenusMars, FaBirthdayCake, FaInfoCircle, FaBook } from 'react-icons/fa';

import './Profile.css';

const Profile = () => {
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
              } else {
                  navigate('/LoginPage');
              }
          } catch (err) {
              console.error('Error retrieving token:', err);
          }
      };
  
      getToken();
  
      if (!profile.country && !profile.city && !profile.village) {
          navigator.geolocation.getCurrentPosition(
              async (position) => {
                  const { latitude, longitude } = position.coords;
                  try {
                      const response = await axios.get(
                          `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=22f2b0c405f545b2b40c99d92f01127e`
                      );
                      if (response.data && response.data.results.length > 0) {
                          const components = response.data.results[0].components;
                          setProfile((prevProfile) => ({
                              ...prevProfile,
                              country: components.country || '',
                              city: components.city || components.town || components.village || '',
                              village: components.village || '',
                          }));
                      }
                  } catch (error) {
                      console.error('Geolocation API error:', error);
                  }
              },
              (error) => {
                  console.error('Geolocation error:', error);
              }
          );
      }
  }, [navigate]);
  

    const fetchProfile = async (token) => {
        try {
            const res = await axios.get('http://localhost:5000/profile/', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 200) {
                setProfile(res.data);
            }
        } catch (err) {
            if (err.response) {
                console.error('Fetch profile error:', err.response.data);
                alert('Error fetching profile data: ' + err.response.data.message);
            } else {
                console.error('Unknown error:', err.message);
                alert('Error fetching profile data.');
            }
        }
    };

    const handleChange = (field, value) => {
        setProfile({ ...profile, [field]: value });
    };

    const handleSave = async () => {
        const editableFields = [
            'username', 'name', 'last_name', 'phone_number', 'gender','country',
            'city', 'village', 'bio', 'experience', 'date_of_birth', 'profile_picture',
            'identity_picture', 'skills'
        ];

        const cleanedProfile = {};
        editableFields.forEach((key) => {
            if (profile[key] !== undefined && profile[key] !== null) {
                cleanedProfile[key] = profile[key];
            }
        });

        try {
            const res = await axios.put('http://localhost:5000/profile/', cleanedProfile, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Profile updated:', res.data);
            setIsEditing(false);
            fetchProfile(token);
        } catch (err) {
            if (err.response) {
                console.error('Validation error:', err.response.data);
                alert(JSON.stringify(err.response.data.errors || err.response.data.msg, null, 2));
            } else {
                console.error('Unknown error:', err.message);
            }
        }
    };

    return (
        <div className="profile-container">
            <header className="appbar">
                <h1>My Profile</h1>
            </header>

            <div className="profile-content">
                {profile.profile_picture && (
                    <img src={profile.profile_picture} alt="Profile" className="profile-image" />
                )}

                {/* Basic Info */}
<div className="card">
  <h2>Basic Information</h2>
  <div className="input-with-icon">
    <FaUser className="input-icon" />
    <input
      type="text"
      value={profile.name || ''}
      onChange={(e) => handleChange('name', e.target.value)}
      disabled={!isEditing}
      placeholder="First Name"
    />
  </div>

  <div className="input-with-icon">
    <FaUserCircle className="input-icon" />
    <input
      type="text"
      value={profile.last_name || ''}
      onChange={(e) => handleChange('last_name', e.target.value)}
      disabled={!isEditing}
      placeholder="Last Name"
    />
  </div>

  <div className="input-with-icon">
    <FaUserCircle className="input-icon" />
    <input
      type="text"
      value={profile.username || ''}
      onChange={(e) => handleChange('username', e.target.value)}
      disabled={!isEditing}
      placeholder="Username"
    />
  </div>
</div>

{/* Contact Info */}
<div className="card">
  <h2>Contact Information</h2>

  <div className="input-with-icon">
    <FaEnvelope className="input-icon" />
    <input
      type="email"
      value={profile.email || ''}
      disabled
      placeholder="Email"
    />
  </div>

  <div className="input-with-icon">
    <FaPhone className="input-icon" />
    <input
      type="text"
      value={profile.phone_number || ''}
      onChange={(e) => handleChange('phone_number', e.target.value)}
      disabled={!isEditing}
      placeholder="Phone Number"
    />
  </div>
  <div className="input-with-icon">
  <FaCity className="input-icon" />
  <input
    type="text"
    value={profile.country || ''}
    onChange={(e) => handleChange('country', e.target.value)}
    disabled={!isEditing}
    placeholder="Country"
  />
</div>

  <div className="input-with-icon">
    <FaCity className="input-icon" />
    <input
      type="text"
      value={profile.city || ''}
      onChange={(e) => handleChange('city', e.target.value)}
      disabled={!isEditing}
      placeholder="City"
    />
  </div>

  <div className="input-with-icon">
    <FaHome className="input-icon" />
    <input
      type="text"
      value={profile.village || ''}
      onChange={(e) => handleChange('village', e.target.value)}
      disabled={!isEditing}
      placeholder="Village"
    />
  </div>
</div>

{/* Volunteer Info */}
<div className="card">
  <h2> Other information </h2>

  <div className="input-with-icon">
    <FaVenusMars className="input-icon" />
    <input
      type="text"
      value={profile.gender || ''}
      onChange={(e) => handleChange('gender', e.target.value)}
      disabled={!isEditing}
      placeholder="Gender"
    />
  </div>

  <div className="input-with-icon">
    <FaBirthdayCake className="input-icon" />
    <input
      type="text"
      value={profile.date_of_birth || ''}
      onChange={(e) => handleChange('date_of_birth', e.target.value)}
      disabled={!isEditing}
      placeholder="Date of Birth"
    />
  </div>

  <div className="input-with-icon">
    <FaInfoCircle className="input-icon" />
    <textarea
      value={profile.bio || ''}
      onChange={(e) => handleChange('bio', e.target.value)}
      disabled={!isEditing}
      placeholder="Bio"
    />
  </div>

  <div className="input-with-icon">
    <FaBook className="input-icon" />
    <input
      type="text"
      value={profile.experience || ''}
      onChange={(e) => handleChange('experience', e.target.value)}
      disabled={!isEditing}
      placeholder="Experience"
    />
  </div>
</div>

                {/* Buttons with icons */}
                <div className="button-group">
                    <button onClick={() => setIsEditing(!isEditing)} className="action-button">
                        <FaEdit style={{ marginRight: '8px' }} />
                        {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                    </button>

                    {isEditing && (
                        <button onClick={handleSave} className="action-button">
                            <FaSave style={{ marginRight: '8px' }} />
                            Save Changes
                        </button>
                    )}

                    <button
                        onClick={() => navigate('/ChangePasswordProfile')}
                        className="action-button"
                    >
                        <FaLock style={{ marginRight: '8px' }} />
                        Update Password
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
