import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signupscreen.css'; 
import volunteerImage from '../images/organSingup.png';

const Signuporganization = ({ role }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [organizationName, setOrganizationName] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showResendForm, setShowResendForm] = useState(false);

  const handleNext = async () => {
    if (!organizationName || !description || !email || !password || !phone) {
      alert('Please fill all fields');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: organizationName,
          description,
          email,
          password,
          phone_number: phone,
          role: role, // Use the role prop here
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        alert(data.msg);
        setStep(2);
      } else {
        alert(data.msg || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to connect to server');
    }
  };

  const handleVerification = async () => {
    if (!verificationCode || !email) {
      alert('Please enter your email and verification code');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          code: verificationCode,
        }),
      });
  
      const data = await response.json();
  
      if (response.status === 200) {
        alert('Account verified successfully!');
        setStep(3);
      } else {
        alert(data.msg || 'Invalid code');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to connect to server');
    }
  };

  const finishSignup = () => {
    if (!email) {
      alert('Please enter your email again to finish');
      return;
    }
    setStep(4);
  };

  const handleResend = async () => {
    if (!email) {
      alert('Please enter your email');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/auth/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error('Response is not JSON');
      }

      if (response.status === 200) {
        alert(data.msg || 'Verification code resent');
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
      <img src={volunteerImage} alt="Signup" className="headerImage" />
      <div className="progressContainer">
        <div className={`progressStep ${step >= 1 ? 'activeStep' : ''}`} />
        <div className={`progressStep ${step >= 2 ? 'activeStep' : ''}`} />
        <div className={`progressStep ${step >= 3 ? 'activeStep' : ''}`} />
        <div className={`progressStep ${step >= 4 ? 'activeStep' : ''}`} />
      </div>

      {step === 1 && (
        <>
          <h1 className="title">Create Organization Account</h1>
          <input type="text" placeholder="Organization Name" value={organizationName} onChange={e => setOrganizationName(e.target.value)} className="input" />
          <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="input" />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="input" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="input" />
          <input type="text" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} className="input" />
          <button className="button" onClick={handleNext}>Next</button>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="title">Enter Verification Code</h1>
          <input type="text" placeholder="Verification Code" value={verificationCode} onChange={e => setVerificationCode(e.target.value)} className="input" />
          <button className="button" onClick={handleVerification}>Verify & Continue</button>
          
          <p>
            <a 
              href="#!" 
              className="resendLink" 
              onClick={() => setShowResendForm(!showResendForm)}
            >
              Resend Code
            </a>
          </p>

          {showResendForm && (
            <div className="resendForm">
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
          )}
        </>
      )}

      {step === 3 && (
        <>
          <h1 className="title">Finish Sign Up</h1>
          <input type="email" placeholder="Confirm Email" value={email} onChange={e => setEmail(e.target.value)} className="input" />
          <button className="button" onClick={finishSignup}>Finish</button>
        </>
      )}

      {step === 4 && (
        <>
          <h1 className="welcomeTitle">Welcome, {organizationName}!</h1>
          <h2 className="welcomeTitle">Your account is now set up!</h2>
          <p className="welcomeSubtitle">Thank you for joining us!</p>
          <button className="button" onClick={() => navigate('/LoginPage')}>Go to Login</button>
        </>
      )}
    </div>
  );
};

export default Signuporganization;
