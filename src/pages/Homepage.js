import React from 'react';
import './Homepage.css';
import volunteerImage from '../images/volunter1.jpg'; // Adjust path to your image
import Navbar from '../pages/Navbar';  // عدل المسار حسب مكان ملف Navbar.js
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const navigate = useNavigate();

   const handleClick = () => {
    navigate('/OppertinetisPublicUser');
  };
  return (

    <div className="home-container">
   
      <Navbar />
      <section className="hero-section">
        <div className="hero-text">
          <h1>Together We Build a Better Community</h1>
          <p>
            Volunteering is a bridge of love and connection. Through it, we help others and make a real difference in their lives. 
            Join us and discover the power of giving and its impact on your life and those around you.
          </p>
         <button className="btn-primary" onClick={handleClick}>
           Start Volunteering Now
         </button>
        </div>
        <div className="hero-image">
          <img src={volunteerImage} alt="Volunteering and Work" />
        </div>
      </section>

      <section className="values-section">
        <h2>Why Volunteer?</h2>
        <div className="values-cards">
          <div className="card">
            <h3>Skill Development</h3>
            <p>Volunteering helps you acquire new skills and develop your personal and professional abilities.</p>
          </div>
          <div className="card">
            <h3>Building Connections</h3>
            <p>Meet new people who share your values and ambitions.</p>
          </div>
          <div className="card">
            <h3>Making a Difference</h3>
            <p>Be part of the solution and help improve the community around you.</p>
          </div>
        </div>
      </section>  
        <footer className="minimal-footer">
  <div className="footer-inner">
    <h3 className="footer-title">Give & Grow</h3>
    <p className="footer-slogan">Empowering communities, one act at a time.</p>
    <div className="footer-meta">
      <p>Crafted with ❤️ by <strong>Areej</strong> & <strong>Bara'a</strong></p>
      <p>© {new Date().getFullYear()} Give & Grow. All rights reserved.</p>
    </div>
  </div>
</footer>

    </div>
  );
};

export default Home;
