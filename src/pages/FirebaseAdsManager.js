import React, { useEffect, useState } from "react";
import './FirebaseAdsManager.css';
import Sidebar from './Sidebar';
import Navbar from '../pages/Navbar';
import { FaUpload } from 'react-icons/fa';
import { FaCheck, FaTimes } from 'react-icons/fa'; // ✅ ضيف هذا

const token = localStorage.getItem("userToken");

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

export default function FirebaseAdsManager() {
  const [ads, setAds] = useState([]);
  const [form, setForm] = useState({
    store_name: "",
    image_url: "",
    description: "",
    website_url: "",
    is_active: true,
  });
  const [editingAdId, setEditingAdId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/admin/firebase-ads/", {
        headers,
      });
      const data = await res.json();
      setAds(data);
    } catch (error) {
      setMessage("Failed to fetch ads");
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // رفع الصورة على Cloudinary
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setLoading(true);
    try {
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', 'my_unsigned_preset'); // غيّرها للـ preset الخاص بك

          const res = await fetch(
            'https://api.cloudinary.com/v1_1/dhrugparh/image/upload',
            {
              method: 'POST',
              body: formData,
            }
          );
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
        setForm((prev) => ({ ...prev, image_url: firstUrl }));
      }
    } catch (error) {
      alert("Error uploading image");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = editingAdId
      ? `http://localhost:5000/admin/firebase-ads/${editingAdId}`
      : "http://localhost:5000/admin/firebase-ads/create";

    const method = editingAdId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setForm({
          store_name: "",
          image_url: "",
          description: "",
          website_url: "",
          is_active: true,
        });
        setEditingAdId(null);
        fetchAds();
      } else {
        setMessage(data.message || "Error occurred");
      }
    } catch (error) {
      setMessage("Failed to submit form");
    }
    setLoading(false);
  };

  const handleEdit = (ad) => {
    setEditingAdId(ad.id);
    setForm({
      store_name: ad.store_name,
      image_url: ad.image_url,
      description: ad.description || "",
      website_url: ad.website_url || "",
      is_active: ad.is_active,
    });
    setMessage("");
  };

  const handleDelete = async (adId) => {
    if (!window.confirm("Are you sure you want to delete this ad?")) return;
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/admin/firebase-ads/${adId}`,
        {
          method: "DELETE",
          headers,
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        fetchAds();
      } else {
        setMessage(data.message || "Delete failed");
      }
    } catch (error) {
      setMessage("Failed to delete ad");
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="admin-ads-container">
        <h1>Admin Management Advertisements</h1>
        {message && <div className="message">{message}</div>}

        <form onSubmit={handleSubmit} className="ad-form">
          <div className="input-icon-group">
            <i className="fas fa-store"></i>
            <input
              name="store_name"
              placeholder="Store Name"
              value={form.store_name}
              onChange={handleChange}
              required
            />
          </div>

<div className="input-icon-group" style={{ display: 'inline-block', cursor: 'pointer' }}>
      <label htmlFor="image-upload" className="upload-label" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#4caf50',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '8px',
        fontWeight: 'bold',
        userSelect: 'none'
      }}>
        <FaUpload size={20} />
        Upload Image
      </label>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />
    </div>

          <div className="input-icon-group">
            <i className="fas fa-align-left"></i>
            <input
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="input-icon-group">
            <i className="fas fa-globe"></i>
            <input
              name="website_url"
              placeholder="Website URL"
              value={form.website_url}
              onChange={handleChange}
            />
          </div>
<div style={{ display: 'flex', alignItems: 'center' }}>
  <label
    style={{
      position: 'relative',
      display: 'inline-block',
      width: '48px',
      height: '26px',
      cursor: 'pointer',
    }}
    title={form.is_active ? 'Enabled' : 'Disabled'} // Optional tooltip
  >
    <input
      type="checkbox"
      name="is_active"
      checked={form.is_active}
      onChange={handleChange}
      style={{ opacity: 0, width: 0, height: 0 }}
    />

    {/* Background */}
    <span
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: form.is_active ? '#4caf50' : '#bbb',
        transition: '0.3s',
        borderRadius: '34px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: form.is_active ? 'flex-end' : 'flex-start',
        padding: '0 5px',
      }}
    >
      {/* Icon only (no background box) */}
      <span style={{ color: 'white', fontSize: '14px' }}>
        {form.is_active ? <FaCheck /> : <FaTimes />}
      </span>
    </span>
  </label>
</div>
<div>


    
</div>

<div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
  <button
    type="submit"
    disabled={loading}
    style={{
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '8px',
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? 0.6 : 1,
      fontWeight: 'bold',
      transition: '0.3s',
    }}
  >
    {editingAdId ? "Update Ad" : "Create Ad"}
  </button>

  {editingAdId && (
    <button
      type="button"
      onClick={() => {
        setEditingAdId(null);
        setForm({
          store_name: "",
          image_url: "",
          description: "",
          website_url: "",
          is_active: true,
        });
        setMessage("");
      }}
      style={{
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: '0.3s',
      }}
    >
      Cancel
    </button>
  )}
</div>

         
        </form>

        <hr />

        {loading && <p>Loading...</p>}

        <ul className="ads-list">
          {ads.map((ad) => (
            <li key={ad.id} className={`ad-item ${ad.is_active ? "" : "inactive"}`}>
              <img src={ad.image_url} alt={ad.store_name} />
              <div className="ad-details">
                <h3>{ad.store_name}</h3>
                <p>{ad.description}</p>
                <a href={ad.website_url} target="_blank" rel="noreferrer">
                  {ad.website_url}
                </a>
                <p>Status: {ad.is_active ? "Active" : "Inactive"}</p>
              </div>
              <div className="ad-actions">
                <button onClick={() => handleEdit(ad)}>
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button onClick={() => handleDelete(ad.id)}>
                  <i className="fas fa-trash-alt"></i> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
