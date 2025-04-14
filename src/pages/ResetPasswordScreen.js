import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Changed from useHistory to useNavigate
import './ResetPasswordScreen.css'; // Import your custom CSS file
import resetPasswordImage from '../images/restPasssword.png';

const ResetPasswordScreen = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate(); // useNavigate hook

  const handleRequestCode = async () => {
    if (!email) {
      alert('Please enter your email');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.107:5000/auth/reset-password-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.status === 200) {
        alert('Verification code sent to email');
        setStep(2);
      } else {
        alert(data.msg || 'Failed to send code');
      }
    } catch (error) {
      console.error(error);
      alert('Server connection failed');
    }
  };

  const handleResetPassword = async () => {
    if (!code || !newPassword) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.107:5000/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, new_password: newPassword }),
      });

      const data = await response.json();

      if (response.status === 200) {
        alert('Password reset successfully');
        navigate('/LoginPage'); // Use navigate to redirect to login page
      } else {
        alert(data.msg || 'Failed to reset password');
      }
    } catch (error) {
      console.error(error);
      alert('Server connection failed');
    }
  };

  return (
    <div className="container">
      <img
        src={resetPasswordImage} // Fixed the typo in the image path
        alt="Reset Password"
        className="headerImage"
      />

      <div className="progressContainer">
        <div className={`progressStep ${step >= 1 ? 'activeStep' : ''}`} />
        <div className={`progressStep ${step >= 2 ? 'activeStep' : ''}`} />
      </div>

      {step === 1 ? (
        <>
          <h2 className="title">Reset Password</h2>
          <input
            className="input"
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="button" onClick={handleRequestCode}>
            Send Code
          </button>
        </>
      ) : (
        <>
          <h2 className="title">Enter Code & New Password</h2>
          <input
            className="input"
            type="text"
            placeholder="Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <input
            className="input"
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button className="button" onClick={handleResetPassword}>
            Reset Password
          </button>
        </>
      )}
    </div>
  );
};

export default ResetPasswordScreen;

