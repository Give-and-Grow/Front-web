import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="minimal-footer">
      <div className="footer-inner">
        <h3 className="footer-title">Give & Grow</h3>
        <p className="footer-slogan">Empowering communities, one act at a time.</p>

        <nav className="footer-links">
          <a href="/AdRequestForm" className="footer-link">Advertise With Us</a>
          <a href="/About" className="footer-link">About Us</a>
          <a href="/Contact" className="footer-link">Contact Us</a>
        </nav>

        <div className="social-links">
          <a href="https://www.linkedin.com/in/your-profile" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-link">
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a href="https://github.com/your-profile" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="social-link">
            <i className="fab fa-github"></i>
          </a>
        </div>

        <div className="footer-meta">
          <p>Crafted with ❤️ by <strong>Areej</strong> & <strong>Bara'a</strong></p>
          <p>© {new Date().getFullYear()} Give & Grow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
