import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    // استرجاع التوكن عند تحميل الصفحة
    useEffect(() => {
        const getToken = async () => {
            try {
                const savedToken = localStorage.getItem('userToken');
                console.log('Saved Token:', savedToken); // طباعة التوكن للتحقق
                if (savedToken) {
                    setToken(savedToken);
                    fetchProfile(savedToken);
                } else {
                    navigate('/LoginPage'); // إعادة التوجيه إلى صفحة تسجيل الدخول إذا لم يكن هناك توكين
                }
            } catch (err) {
                console.error('Error retrieving token:', err);
            }
        };

        getToken();
    }, [navigate]);

    // جلب البيانات من الـ API
    const fetchProfile = async (token) => {
        console.log('Token:', token); // طباعة التوكن للتحقق
        try {
            const res = await axios.get('http://localhost:5000/profile', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 200) {
                setProfile(res.data);
            } else {
                console.error('Unexpected response status:', res.status);
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

    // التعامل مع تغيير البيانات
    const handleChange = (field, value) => {
        setProfile({ ...profile, [field]: value });
    };

    // حفظ التغييرات بعد التعديل
    const handleSave = async () => {
        const editableFields = [
            'name', 'last_name', 'username', 'phone_number', 'gender',
            'city', 'village', 'bio', 'experience', 'date_of_birth', 'profile_picture'
        ];

        const cleanedProfile = {};
        editableFields.forEach((key) => {
            if (profile[key] !== undefined && profile[key] !== null) {
                cleanedProfile[key] = profile[key];
            }
        });

        try {
            const res = await axios.put('http://localhost:5000/profile', cleanedProfile, {
                headers: { Authorization: `Bearer ${token}` }, // إرسال التوكين في الهيدر
            });
            console.log('Profile updated:', res.data);
            setIsEditing(false);
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
                    <input
                        type="text"
                        value={profile.name || ''}
                        onChange={(e) => handleChange('name', e.target.value)}
                        disabled={!isEditing}
                        placeholder="First Name"
                    />
                    <input
                        type="text"
                        value={profile.last_name || ''}
                        onChange={(e) => handleChange('last_name', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Last Name"
                    />
                    <input
                        type="text"
                        value={profile.username || ''}
                        onChange={(e) => handleChange('username', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Username"
                    />
                </div>

                {/* Contact Info */}
                <div className="card">
                    <h2>Contact Information</h2>
                    <input
                        type="email"
                        value={profile.email || ''}
                        disabled
                        placeholder="Email"
                    />
                    <input
                        type="text"
                        value={profile.phone_number || ''}
                        onChange={(e) => handleChange('phone_number', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Phone Number"
                    />
                    <input
                        type="text"
                        value={profile.city || ''}
                        onChange={(e) => handleChange('city', e.target.value)}
                        disabled={!isEditing}
                        placeholder="City"
                    />
                    <input
                        type="text"
                        value={profile.village || ''}
                        onChange={(e) => handleChange('village', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Village"
                    />
                </div>

                {/* Volunteer Info */}
                <div className="card">
                    <h2>Volunteer Information</h2>
                    <input
                        type="text"
                        value={profile.gender || ''}
                        onChange={(e) => handleChange('gender', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Gender"
                    />
                    <input
                        type="text"
                        value={profile.date_of_birth || ''}
                        onChange={(e) => handleChange('date_of_birth', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Date of Birth"
                    />
                    <textarea
                        value={profile.bio || ''}
                        onChange={(e) => handleChange('bio', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Bio"
                    />
                    <input
                        type="text"
                        value={profile.experience || ''}
                        onChange={(e) => handleChange('experience', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Experience"
                    />
                </div>

                <div className="button-group">
                    <button onClick={() => setIsEditing(!isEditing)} className="action-button">
                        {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                    </button>

                    {isEditing && (
                        <button onClick={handleSave} className="action-button">
                            Save Changes
                        </button>
                    )}

                    <button
                        onClick={() => navigate('/change-password')}
                        className="action-button"
                    >
                        Update Password
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
