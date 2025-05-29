import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Signupscreen.css'; // استورد ملف CSS
import volunteerImage from '../images/Signup.gif';
import Navbar from '../pages/Navbar';  // عدل المسار حسب مكان ملف Navbar.js
const SignupScreen = ({ role }) => {
  const navigate = useNavigate(); // Use useNavigate hook to get navigate function
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showResendForm, setShowResendForm] = useState(false); // New state to toggle resend form

  const handleNext = async () => {
    if (!firstName || !lastName || !birthday || !gender || !email || !password || !phone) {
      alert('Please fill all fields');
      return;
    }
  
    // Validate the date format using regex (YYYY-MM-DD)
    const birthdayRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!birthdayRegex.test(birthday)) {
      alert('Please enter a valid birthday in the format YYYY-MM-DD');
      return;
    }
  
    // Create a new Date object from the input and check if it's a valid date
    const [year, month, day] = birthday.split('-');
    const date = new Date(year, month - 1, day); // month is 0-indexed in JavaScript Date
    if (date.getFullYear() !== parseInt(year) || date.getMonth() !== parseInt(month) - 1 || date.getDate() !== parseInt(day)) {
      alert('Please enter a valid date');
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
          gender,
          email,
          password,
          phone_number: phone,
          role, // تأكد أن هنا يتم إرسال role بالضبط
        }),
        
      });
  
      const data = await response.json();
  
      if (response.status === 201) {
        alert(data.msg);
        setUsername(data.username);
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
      console.log('Raw response:', text);

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
     <>
      <Navbar />
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
          <h1 className="title">Create Account</h1>
          <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} className="input" />
          <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} className="input" />
          <input type="text" placeholder="Birthday (YYYY-MM-DD)" value={birthday} onChange={e => setBirthday(e.target.value)} className="input" />
          
          <div className="genderContainer">
            <button className={`genderButton ${gender === 'Male' ? 'selectedGender' : ''}`} onClick={() => setGender('Male')}>Male</button>
            <button className={`genderButton ${gender === 'Female' ? 'selectedGender' : ''}`} onClick={() => setGender('Female')}>Female</button>
          </div>

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
              onClick={() => setShowResendForm(!showResendForm)} // Toggle resend form visibility
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
          <h1 className="welcomeTitle">Welcome, {firstName}!</h1>
          <h2 className="welcomeTitle">Your username is {username}</h2>
          <p className="welcomeSubtitle">We're happy to have you 🎉</p>
          <button className="button" onClick={() => navigate('/LoginPage')}>Go to Login</button>
        </>
      )}
    </div>
     </>
   
  );
};

export default SignupScreen;
