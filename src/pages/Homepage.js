import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './Homepage.css';
import hero from '../images/volunter1.jpg';
import mission from '../images/volunter1.jpg';
import logo from '../images/volunter1.jpg';

const Homepage = () => {
  const opportunities = [
    { title: 'Education', description: 'Help children learn and grow.', image: hero },
    { title: 'Healthcare', description: 'Support health campaigns.', image: mission },
    { title: 'Environment', description: 'Contribute to a greener future.', image: hero },
  ];

  return (
    <div className="homepage">
      {/* Navbar */}
      <nav className="navbar">
        <img src={logo} alt="logo" className="logo" />
        <ul className="nav-links">
          <li>Home</li>
          <li>Opportunities</li>
          <li>About</li>
          <li>Contact</li>
          {/* Add Profile button */}
          <li><Link to="/profile">Profile</Link></li>
        </ul>
      </nav>

      {/* Hero */}
      <section className="hero" style={{ backgroundImage: `url(${hero})` }}>
        <div className="hero-overlay">
          <h1>Empower Volunteers. Elevate Communities.</h1>
          <p>Join a movement of change and service across the nation.</p>
          <button className="hero-btn">Join Now</button>
        </div>
      </section>

      {/* Mission */}
      <section className="mission">
        <div className="mission-text">
          <h2>Our Mission</h2>
          <p>We aim to connect passionate volunteers with meaningful opportunities to serve their communities and make a difference.</p>
        </div>
        <img src={mission} alt="mission" className="mission-img" />
      </section>

      {/* Opportunities */}
      <section className="opportunities">
        <h2 className="section-title">Volunteer Opportunities</h2>
        <div className="opportunity-grid">
          {opportunities.map((item, i) => (
            <div key={i} className="opportunity-card">
              <img src={item.image} alt={item.title} />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <button>Learn More</button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Give & Grow. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;
