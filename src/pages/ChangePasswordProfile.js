import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ إضافة useNavigate
import axios from 'axios';
import './ChangePasswordProfile.css';
import image from '../images/animationchangepassword-unscreen.gif';
const ChangePasswordProfile = () => {
  const navigate = useNavigate(); // ✅ إنشاء كائن navigate
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert('New password and confirm password do not match');
      return;
    }

    if (newPassword.length < 6) {
      alert('New password should be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('No token found, please log in again');
        navigate('/LoginPage'); // ✅ إعادة التوجيه إلى صفحة تسجيل الدخول
        return;
      }

      const response = await axios.put(
        'http://localhost:5000/profile/change-password',
        {
          old_password: oldPassword,
          new_password: newPassword,
          confirm_new_password: confirmNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert('Password changed successfully!');
        navigate('/LoginPage'); // ✅ إعادة التوجيه إلى صفحة تسجيل الدخول بعد تغيير الباسورد
      } else {
        alert(response.data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Password change error:', error.response?.data || error);
      alert('Failed to connect to the server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
       <img src={image} alt="Change Password" className="header-image" />

      <h2 className="title">Change Your Password</h2>

      <input
        type="password"
        className="input"
        placeholder="Old Password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />

      <input
        type="password"
        className="input"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <input
        type="password"
        className="input"
        placeholder="Confirm New Password"
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
      />

      <button
        className={`button ${isLoading ? 'buttonDisabled' : ''}`}
        onClick={handlePasswordChange}
        disabled={isLoading}
      >
        {isLoading ? 'Changing...' : 'Change Password'}
      </button>

      <button
        className="link"
        onClick={() => navigate('/LoginPage')} // ✅ تصحيح الرابط
      >
        Back to Login
      </button>
    </div>
  );
};

export default ChangePasswordProfile;
