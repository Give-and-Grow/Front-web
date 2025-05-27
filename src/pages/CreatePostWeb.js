import React, { useState, useEffect, useRef } from 'react';
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
  const [imageFiles, setImageFiles] = useState([]); // ملفات الصور
  const fileInputRef = useRef(null);

  const handleAddImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // يفتح نافذة اختيار ملف جديدة
    }
  };
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
const handleImageChange = async (e) => {
  const files = Array.from(e.target.files);
  if (files.length === 0) return;

  // ارفع الصور الجديدة فقط
  const uploadedUrls = await Promise.all(files.map(async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'my_unsigned_preset'); // عدلها

    const res = await fetch('https://api.cloudinary.com/v1_1/dhrugparh/image/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (data.secure_url) {
      return data.secure_url;
    } else {
      alert('Failed to upload image: ' + (data.error?.message || 'Unknown error'));
      return null;
    }
  }));

  // فلتر الروابط الصحيحة فقط
  const validUrls = uploadedUrls.filter(url => url !== null);

  // ضف الصور الجديدة على الصور القديمة
  setImageLinks(prevLinks => [...prevLinks.filter(link => link !== ''), ...validUrls]);

  // مهم: رجع قيمة input للملفات فارغة حتى يمكن رفع نفس الملفات مرة أخرى لو أردت
  e.target.value = null;
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
      images: imageLinks,
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
  <label><FaImage style={{marginRight: '8px', color: '#388e3c'}} /> Upload Images</label>
 <input
  type="file"
  multiple
  accept="image/*"
  onChange={handleImageChange}
  ref={fileInputRef}   // ربط الـ ref هنا
  style={{ display: 'none' }} // نخفيه، لأننا نريد فتحه بالزر فقط
/>

  <div className="preview-images">
    {imageLinks.map((link, idx) => (
      <img key={idx} src={link} alt={`uploaded-${idx}`} style={{width: '100px', marginRight: '8px'}} />
    ))}
  </div>
  <button onClick={handleAddImageClick} className="add-image-btn" style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
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
