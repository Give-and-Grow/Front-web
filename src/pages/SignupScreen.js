import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import toastify styles
import './Signupscreen.css';
import volunteerImage from '../images/Signup.gif';
import Navbar from '../pages/Navbar';

const SignupScreen = ({ role }) => {
  const navigate = useNavigate();
  const [signupStep, setSignupStep] = useState(1);
  const [createdUsername, setCreatedUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [resendFormVisible, setResendFormVisible] = useState(false);

  const handleNext = async () => {
    // Validate fields and collect missing ones
    const missingFields = [];
    if (!firstName) missingFields.push('First Name');
    if (!lastName) missingFields.push('Last Name');
    if (!birthDate) missingFields.push('Birth Date');
    if (!selectedGender) missingFields.push('Gender');
    if (!userEmail) missingFields.push('Email');
    if (!userPassword) missingFields.push('Password');
    if (!userPhone) missingFields.push('Phone Number');

    if (missingFields.length > 0) {
      toast.error(`Please fill the following fields: ${missingFields.join(', ')}`);
      return;
    }

    const [year, month, day] = birthDate.split('-');
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== parseInt(year) || date.getMonth() !== parseInt(month) - 1 || date.getDate() !== parseInt(day)) {
      toast.error('Please enter a valid date');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          last_name: lastName,
          day,
          month,
          year,
          gender: selectedGender,
          email: userEmail,
          password: userPassword,
          phone_number: userPhone,
          role,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        toast.success(data.msg);
        setCreatedUsername(data.username);
        setSignupStep(2);
      } else {
        toast.error(data.msg || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to connect to server');
    }
  };

  const handleVerification = async () => {
    const missingFields = [];
    if (!userEmail) missingFields.push('Email');
    if (!codeInput) missingFields.push('Verification Code');

    if (missingFields.length > 0) {
      toast.error(`Please enter the following: ${missingFields.join(', ')}`);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          code: codeInput,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        toast.success('Account verified successfully!');
        setSignupStep(3);
      } else {
        toast.error(data.msg || 'Invalid code');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to connect to server');
    }
  };

  const finishSignup = () => {
    if (!userEmail) {
      toast.error('Please enter your email again to finish');
      return;
    }
    setSignupStep(4);
  };

  const handleResend = async () => {
    if (!userEmail) {
      toast.error('Please enter your email');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/auth/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });

      const text = await response.text();
      console.log('Raw response:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error('Response is not JSON');
      }

      if (response.status === 200) {
        toast.success(data.msg || 'Verification code resent');
      } else {
        toast.error(data.msg || 'Failed to resend code');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to connect to server');
    }
  };

  return (
    <>
      <Navbar />
      <div className="signup-container">
        <img src={volunteerImage} alt="Signup" className="signup-header-image" />

        <div className="signup-progress-container">
          <div className={`signup-progress-step ${signupStep >= 1 ? 'signup-active-step' : ''}`} />
          <div className={`signup-progress-step ${signupStep >= 2 ? 'signup-active-step' : ''}`} />
          <div className={`signup-progress-step ${signupStep >= 3 ? 'signup-active-step' : ''}`} />
          <div className={`signup-progress-step ${signupStep >= 4 ? 'signup-active-step' : ''}`} />
        </div>

        {signupStep === 1 && (
          <>
            <h1 className="signup-title">Create Account</h1>
            <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} className="signup-input" />
            <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} className="signup-input" />
            <input type="date" placeholder="Birthday" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="signup-input" />

            <div className="signup-gender-container">
              <button className={`signup-gender-button ${selectedGender === 'Male' ? 'signup-selected-gender' : ''}`} onClick={() => setSelectedGender('Male')}>Male</button>
              <button className={`signup-gender-button ${selectedGender === 'Female' ? 'signup-selected-gender' : ''}`} onClick={() => setSelectedGender('Female')}>Female</button>
            </div>

            <input type="email" placeholder="Email" value={userEmail} onChange={e => setUserEmail(e.target.value)} className="signup-input" />
            <input type="password" placeholder="Password" value={userPassword} onChange={e => setUserPassword(e.target.value)} className="signup-input" />
            <input type="text" placeholder="Phone Number" value={userPhone} onChange={e => setUserPhone(e.target.value)} className="signup-input" />

            <button className="signup-button" onClick={handleNext}>Next</button>
          </>
        )}

        {signupStep === 2 && (
          <>
            <h1 className="signup-title">Enter Verification Code</h1>
            <input type="text" placeholder="Verification Code" value={codeInput} onChange={e => setCodeInput(e.target.value)} className="signup-input" />
            <button className="signup-button" onClick={handleVerification}>Verify & Continue</button>

            <p>
              <a href="#!" className="signup-resend-link" onClick={() => setResendFormVisible(!resendFormVisible)}>
                Resend Code
              </a>
            </p>

            {resendFormVisible && (
              <div className="signup-resend-form">
                <input type="email" className="signup-input" placeholder="Enter your email" value={userEmail} onChange={e => setUserEmail(e.target.value)} />
                <button className="signup-button" onClick={handleResend}>Resend Code</button>
              </div>
            )}
          </>
        )}

        {signupStep === 3 && (
          <>
            <h1 className="signup-title">Finish Sign Up</h1>
            <input type="email" placeholder="Confirm Email" value={userEmail} onChange={e => setUserEmail(e.target.value)} className="signup-input" />
            <button className="signup-button" onClick={finishSignup}>Finish</button>
          </>
        )}

        {signupStep === 4 && (
          <>
            <h1 className="signup-welcome-title">Welcome, {firstName}!</h1>
            <h2 className="signup-welcome-title">Your username is {createdUsername}</h2>
            <p className="signup-welcome-subtitle">We're happy to have you 🎉</p>
            <button className="signup-button" onClick={() => navigate('/LoginPage')}>Go to Login</button>
          </>
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default SignupScreen;