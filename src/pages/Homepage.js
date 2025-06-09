import React, { useEffect, useState } from 'react';
import './Homepage.css';
import volunteerImage from '../images/volunter1.jpg'; // عدل المسار حسب صورتك
import Navbar from '../pages/Navbar';  // عدل المسار حسب مكان ملف Navbar.js

const token = localStorage.getItem("userToken");

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

const Home = () => {
  const [ads, setAds] = useState([]);
  const [loadingAds, setLoadingAds] = useState(false);
  const [adsError, setAdsError] = useState("");

  useEffect(() => {
    fetchAds();
  }, []);
const fetchAds = async () => {
  setLoadingAds(true);
  setAdsError("");
  try {
    const res = await fetch("http://localhost:5000/admin/firebase-ads/");
    if (!res.ok) throw new Error("Failed to fetch ads");
    const data = await res.json();
    setAds(data);
  } catch (error) {
    setAdsError(error.message);
  }
  setLoadingAds(false);
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
          <button className="btn-primary" onClick={() => window.location.href='/OppertinetisPublicUser'}>
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

      {/* قسم الإعلانات */}
      <section className="ads-section">
        <h2>Advertisements</h2>
        {loadingAds && <p>Loading ads...</p>}
        {adsError && <p className="error">{adsError}</p>}
        {!loadingAds && !adsError && ads.length === 0 && <p>No ads to show.</p>}
        <div className="ads-grid">
          {ads.map(ad => (
            <div key={ad.id} className={`ad-card ${ad.is_active ? '' : 'inactive'}`}>
              <img src={ad.image_url} alt={ad.store_name} />
              <h3>{ad.store_name}</h3>
              <p>{ad.description}</p>
              <a href={ad.website_url} target="_blank" rel="noreferrer">{ad.website_url}</a>
            
            </div>
          ))}
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
