import React, { useState } from 'react';
import './AdRequestForm.css';
import Navbar from '../pages/Navbar';
import Footer from '../components/Footer'; // مسار الفوتر الجديد حسب مكانه عندك

import AdComponent from './AdComponent'

const AdRequestForm = () => {
  const [formData, setFormData] = useState({
    store_name: '',
    image_url: '',
    description: '',
    website_url: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setLoading(true);
    try {
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const imageData = new FormData();
          imageData.append('file', file);
          imageData.append('upload_preset', 'my_unsigned_preset'); // غيّر هذا حسب preset تبعك

          const res = await fetch('https://api.cloudinary.com/v1_1/dhrugparh/image/upload', {
            method: 'POST',
            body: imageData
          });

          const data = await res.json();
          if (data.secure_url) {
            return data.secure_url;
          } else {
            alert('Failed to upload image: ' + (data.error?.message || 'Unknown error'));
            return null;
          }
        })
      );

      const firstUrl = uploadedUrls.find((url) => url !== null);
      if (firstUrl) {
        setFormData((prev) => ({ ...prev, image_url: firstUrl }));
      }
    } catch (error) {
      alert("Error uploading image");
    }
    setLoading(false);
  };

  const validateForm = () => {
    if (!formData.store_name || !formData.image_url || !formData.description || !formData.website_url || !formData.email) {
      setError('All fields are required.');
      return false;
    }
    if (!/^https?:\/\/.+/.test(formData.website_url)) {
      setError('Please enter a valid website URL starting with http:// or https://');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/admin/firebase-ads/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (response.ok) {
        setSuccess('Ad request submitted successfully! You will be notified once reviewed.');
        setFormData({
          store_name: '',
          image_url: '',
          description: '',
          website_url: '',
          email: ''
        });
      } else {
        setError(result.message || 'Failed to submit ad request.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="ad-form-page">
      <AdComponent/>
      <div className="ad-form-container">
      
      {success && <div className="ad-form-success">{success}</div>}
      {error && <div className="ad-form-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <h2>Apply to Advertise with Us</h2>
        <div className="ad-form-row">
          <div className="ad-form-group">
            <label htmlFor="store_name">Store Name</label>
            <input type="text" id="store_name" name="store_name" value={formData.store_name} onChange={handleChange} placeholder="Enter store name" />
          </div>
          <div className="ad-form-group">
            <label htmlFor="image_upload">Upload Image</label>
            <input type="file" id="image_upload" name="image_upload" onChange={handleImageChange} accept="image/*" />
          </div>
        </div>

        <div className="ad-form-row">
          <div className="ad-form-group">
            <label htmlFor="website_url">Website URL</label>
            <input type="url" id="website_url" name="website_url" value={formData.website_url} onChange={handleChange} placeholder="https://..." />
          </div>
          <div className="ad-form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" />
          </div>
        </div>

        <div className="ad-form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Enter ad description" />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Ad Request'}
        </button>
      </form>
    </div>
    </div>
          <Footer />

    </>
  );
};

export default AdRequestForm;
