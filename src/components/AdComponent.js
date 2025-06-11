import React, { useEffect, useState } from 'react';
import './AdComponent.css';

const AdComponent = () => {
  const [ads, setAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(true); // حالة الإخفاء

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/admin/firebase-ads');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const activeAds = data.filter(ad => ad.is_active);
        setAds(activeAds);
      } catch (error) {
        console.error('Error fetching ads:', error);
        setError('Failed to load ads.');
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  useEffect(() => {
    if (ads.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [ads]);

  if (!isVisible) return null; // إذا مخفي، ما يعرض شي

  if (loading) {
    return <div className="ad-loading">Loading ad...</div>;
  }

  if (error) {
    return <div className="ad-error">{error}</div>;
  }

  if (ads.length === 0) {
    return <div className="ad-error">No active ads available.</div>;
  }

  const currentAd = ads[currentAdIndex];

  return (
    <div className="ad-component">
      <button className="ad-close-btn" onClick={() => setIsVisible(false)}>
        &times;
      </button>
      <a
        href={currentAd.website_url}
        target="_blank"
        rel="noopener noreferrer"
        className="ad-card"
      >
        <img src={currentAd.image_url} alt={currentAd.store_name} className="ad-image" />
        <div className="ad-content">
          <h4>{currentAd.store_name}</h4>
          <p>{currentAd.description}</p>
        </div>
      </a>
    </div>
  );
};

export default AdComponent;
