import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './WelcomeScreen.css'; // Import CSS for styling

const WelcomeScreen = () => {
  const navigate = useNavigate(); // Use useNavigate hook for navigation

  const handleGetStarted = () => {
    // Navigate to the next screen (e.g., Login or Registration)
    navigate('/LoginPage'); // Adjust the route as needed
  };

  return (
    <div className="container">
      {/* Add an icon or image here to represent the theme */}
      <img src={require('../images/volunteering.png')} alt="Volunteering" className="icon" />
      
      <div className="title">
        <span className="welcomeText">Welcome to</span>
        <span className="volunteerText"> GIVE & GROW </span>
      </div>

      <p className="description">
        Volunteering is the gateway to personal growth and making a difference.
      </p>

      <button className="button" onClick={handleGetStarted}>
        Get Started
      </button>
    </div>
  );
};

export default WelcomeScreen;
