import React, { useState } from 'react';
import './ResendCodeScreen.css'; // Assuming you have an external CSS file
import resendImage from '../images/resend.png';
import { useNavigate } from 'react-router-dom'; // استيراد useNavigate من react-router-dom

const ResendCodeScreen = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate(); // استخدام useNavigate لتغيير المسار

  const handleResend = async () => {
    if (!email) {
      alert('Please enter your email');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.107:5000/auth/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const text = await response.text(); // Get raw text
      console.log('Raw response:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error('Response is not JSON. Maybe it\'s an error page?');
      }

      if (response.status === 200) {
        alert(data.msg || 'Verification code resent');
        navigate('/signup'); // التنقل إلى شاشة الساين أب بعد إرسال الرمز
      } else {
        alert(data.msg || 'Failed to resend code');
      }
    } catch (error) {
      console.error(error);
      alert(error.message || 'Failed to connect to server');
    }
  };

  return (
    <div className="container">
      <img src={resendImage} alt="Verification" className="top-image" />
      <h1 className="title">Resend Verification Code</h1>
      <input
        type="email"
        className="input"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="button" onClick={handleResend}>
        Resend Code
      </button>
    </div>
  );
};

export default ResendCodeScreen;





