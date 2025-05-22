import React, { useState, useEffect } from 'react';
import './CreatePostWeb.css';
import Navbar from '../pages/Navbar'; 
import { FaHeading, FaPenFancy, FaTags, FaPlus, FaImage } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CreatePostWeb = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [imageLinks, setImageLinks] = useState(['']);
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('userToken');
    if (storedToken) setToken(storedToken);
  }, []);

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddImageLink = () => {
    setImageLinks([...imageLinks, '']);
  };

  const handleChangeImageLink = (index, value) => {
    const updated = [...imageLinks];
    updated[index] = value;
    setImageLinks(updated);
  };

  const handleSubmit = async () => {
    if (!token) {
      alert('No token found. Please log in again.');
      return;
    }

    if (tags.filter(t => t.trim()).length === 0) {
      alert('Please add at least one tag.');
      return;
    }

    const postData = {
      title,
      content,
      tags,
      images: imageLinks.filter(Boolean),
    };

    try {
      const res = await fetch('http://localhost:5000/posts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Post created successfully!');
        setTitle('');
        setContent('');
        setTags([]);
        setImageLinks(['']);
        navigate('/FollowingScreen'); // ✅ Navigate to FollowScreen
      }
       else {
        alert(data.message || 'Failed to create post.');
      }
    } catch (err) {
      alert('Failed to connect to server.');
    }
  };

  return (
    <>
    <Navbar />  
    <div className="create-post-container">
      
      <h2 className="create-post-header">📝 Create New Post</h2>

      <div className="form-group">
  <label><FaHeading style={{marginRight: '8px', color: '#388e3c'}} /> Title</label>
  <input
    type="text"
    value={title}
    onChange={e => setTitle(e.target.value)}
    placeholder="Enter post title"
  />
</div>

<div className="form-group">
  <label><FaPenFancy style={{marginRight: '8px', color: '#388e3c'}} /> Content</label>
  <textarea
    value={content}
    onChange={e => setContent(e.target.value)}
    placeholder="Write your content"
  />
</div>

<div className="form-group">
  <label><FaTags style={{marginRight: '8px', color: '#388e3c'}} /> Tags</label>
  <div className="row">
    <input
      type="text"
      value={tagInput}
      onChange={e => setTagInput(e.target.value)}
      placeholder="Add a tag"
      onKeyDown={e => e.key === 'Enter' && handleAddTag()}
    />
    <button onClick={handleAddTag} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <FaPlus />
    </button>
  </div>
  <div className="tag-container">
    {tags.map((tag, idx) => (
      <span key={idx} className="chip">
        #{tag}
        <button onClick={() => handleRemoveTag(tag)} className="chip-close">x</button>
      </span>
    ))}
  </div>
</div>

<div className="form-group">
  <label><FaImage style={{marginRight: '8px', color: '#388e3c'}} /> Image Links</label>
  {imageLinks.map((link, index) => (
    <input
      key={index}
      type="text"
      value={link}
      onChange={e => handleChangeImageLink(index, e.target.value)}
      placeholder={`Image URL ${index + 1}`}
    />
  ))}
  <button onClick={handleAddImageLink} className="add-image-btn" style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
    <FaPlus /> Add Another Image
  </button>
</div>

<button onClick={handleSubmit} className="submit-btn" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
  <FaPenFancy /> Publish Post
</button>

    </div>
    </>
  );
};

export default CreatePostWeb;
