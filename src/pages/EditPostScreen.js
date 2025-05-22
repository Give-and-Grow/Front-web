import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTag, FaImage, FaFileAlt, FaHeading, FaArrowLeft } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../pages/Navbar';

const EditPostScreen = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [images, setImages] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('userToken');
    if (savedToken) setToken(savedToken);
  }, []);

  useEffect(() => {
    const fetchPostData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const post = response.data;
        setTitle(post.title || '');
        setContent(post.content || '');
        setTags(post.tags ? post.tags.join(', ') : '');
        setImages(post.images ? post.images.join(', ') : '');
        setDate(post.created_at || post.updated_at || '');
      } catch (error) {
        setMessage('Failed to load post data.');
      }
      setLoading(false);
    };
    if (token) fetchPostData();
  }, [token, postId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`http://localhost:5000/posts/${postId}`, {
        title,
        content,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        images: images.split(',').map(i => i.trim()).filter(i => i),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Post updated successfully!');
      setTimeout(() => {
        navigate('/FollowingScreen');
      }, 1000);
    } catch (error) {
      setMessage('❌ Failed to update post.');
    }
    setSaving(false);
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <p>Loading post data...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h2>Edit Post</h2>
            <button onClick={() => navigate(-1)} style={styles.backButton}>
              <FaArrowLeft /> Back
            </button>
          </div>

          <div style={styles.dateContainer}>
            <p style={styles.dateText}>📅 {formatDate(date)}</p>
          </div>

          {message && <p style={styles.message}>{message}</p>}

          <label style={styles.label}><FaHeading style={styles.icon} /> Title:</label>
          <input style={styles.input} value={title} onChange={e => setTitle(e.target.value)} />

          <label style={styles.label}><FaFileAlt style={styles.icon} /> Content:</label>
          <textarea style={styles.textarea} value={content} onChange={e => setContent(e.target.value)} />

          <label style={styles.label}><FaTag style={styles.icon} /> Tags (comma-separated):</label>
          <input style={styles.input} value={tags} onChange={e => setTags(e.target.value)} />

          <label style={styles.label}><FaImage style={styles.icon} /> Image URLs (comma-separated):</label>
          <input style={styles.input} value={images} onChange={e => setImages(e.target.value)} />

          <button onClick={handleSave} style={styles.saveButton} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    padding: '2rem',
    minHeight: '100vh',
    background: 'linear-gradient(to right, #e8f5e9, #c8e6c9)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    maxWidth: '700px',
    width: '100%',
    padding: '2rem',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 8px 20px rgba(0, 128, 0, 0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  dateContainer: {
    marginTop: '-0.5rem',
    marginBottom: '1rem',
  },
  dateText: {
    fontSize: '0.95rem',
    color: '#4caf50',
    fontStyle: 'italic',
  },
  backButton: {
    backgroundColor: '#a5d6a7',
    color: '#1b5e20',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'background-color 0.3s ease',
  },
  label: {
    marginTop: '1rem',
    fontWeight: '600',
    color: '#2e7d32',
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    marginTop: '0.4rem',
    borderRadius: '8px',
    border: '1px solid #c8e6c9',
    fontSize: '1rem',
    backgroundColor: '#f1f8e9',
  },
  textarea: {
    width: '100%',
    height: '120px',
    padding: '0.75rem',
    marginTop: '0.4rem',
    borderRadius: '8px',
    border: '1px solid #c8e6c9',
    fontSize: '1rem',
    backgroundColor: '#f1f8e9',
  },
  icon: {
    marginRight: '0.5rem',
    color: '#388e3c',
  },
  saveButton: {
    marginTop: '2rem',
    backgroundColor: '#66bb6a',
    color: '#fff',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease',
  },
  message: {
    marginTop: '1rem',
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.2rem',
    color: '#388e3c',
  },
  textarea: {
    width: '100%',
    height: '120px',
    padding: '0.75rem',
    marginTop: '0.4rem',
    borderRadius: '8px',
    border: '1px solid #c8e6c9',
    fontSize: '1rem',
    backgroundColor: '#f1f8e9',
    resize: 'none', // هذا يمنع المستخدم من تغيير الحجم
  },

};

export default EditPostScreen;
