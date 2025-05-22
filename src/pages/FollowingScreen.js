import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Navbar from '../pages/Navbar';
import './FollowingScreen.css'; // create this CSS file for styles
import { FaUserCog, FaUsers, FaUserPlus, FaPlus, FaEdit, FaTrash, FaUserCircle } from 'react-icons/fa';

const FollowingScreen = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [userData, setUserData] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [posts, setPosts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [activeTab, setActiveTab] = useState('following');

  useEffect(() => {
    const getTokenAndFetch = async () => {
      const savedToken = localStorage.getItem('userToken');
      if (savedToken) {
        setToken(savedToken);
        fetchProfile(savedToken);
        fetchPosts(savedToken);
        fetchFollowers(savedToken);
        fetchFollowing(savedToken);
      }
    };
    getTokenAndFetch();
  }, []);

  const fetchProfile = async (token) => {
    try {
      const res = await axios.get(`http://localhost:5000/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(res.data);
    } catch (err) {
      console.error('Profile error:', err);
    }
  };

  const fetchPosts = async (token) => {
    try {
      const res = await axios.get(`http://localhost:5000/posts/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data || []);
    } catch (err) {
      console.error('Posts error:', err);
    }
  };

  const fetchFollowers = async (token) => {
    try {
      const res = await axios.get(`http://localhost:5000/follow/followers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFollowers(res.data);
    } catch (err) {
      console.error('Followers error:', err);
    }
  };

  const fetchFollowing = async (token) => {
    try {
      const res = await axios.get(`http://localhost:5000/follow/following`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFollowing(res.data);
    } catch (err) {
      console.error('Following error:', err);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      const res = await axios.delete(`http://localhost:5000/follow/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        setFollowing((prev) => prev.filter((user) => user.id !== userId));
        alert('Unfollowed successfully');
      }
    } catch {
      alert('Unfollow failed');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      setPosts(posts.filter((post) => post.id !== postId));
      await axios.delete(`http://localhost:5000/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const renderUserItem = (user) => (
    <div className="user-card" key={user.id}>
      <div className="user-info">
        {user.profile_picture ? (
          <img src={user.profile_picture} alt="avatar" className="avatar" />
        ) : (
          <div className="avatar-placeholder">{user.username[0].toUpperCase()}</div>
        )}
        <span>{user.username}</span>
      </div>
      <button className="unfollow-btn" onClick={() => handleUnfollow(user.id)}>
        Unfollow
      </button>
    </div>
  );

  const renderPostItem = (post) => (
    <div className="post-card" key={post.id}>
      <h3>{post.title}</h3>
      {post.images?.length > 0 && (
        <div className="post-images">
          {post.images.map((img, i) => (
            <img key={i} src={img} alt="post" className="post-image" />
          ))}
        </div>
      )}
      <p>{post.content}</p>
      <div className="tags">
        {post.tags?.map((tag, i) => (
          <span key={i} className="tag">#{tag}</span>
        ))}
      </div>
      <small>
  {new Date(post.created_at).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })}
</small>

      <div className="post-actions">
      <button onClick={() => navigate(`/EditPostScreen/${post.id}`)}>
  <FaEdit /> Edit
</button>


<button onClick={() => handleDeletePost(post.id)} className="delete">
  <FaTrash /> Delete
</button>

      </div>
    </div>
  );

  return (
    <>
    <Navbar />  
    <div className="following-screen">
      <div className="profile-header">
        <div className="profile-info">
          {userData?.profile_picture ? (
            <img src={userData.profile_picture} className="avatar-big" />
          ) : (
            <FaUserCircle size={40} className="avatar-placeholder" />

          )}
          <h2>{userData?.username}</h2>
          <button onClick={() => navigate('/profile')}>
  <FaUserCog size={20} />
</button>

        </div>

        <div className="follow-stats">
          <div className="follow-stat">
          <div className="clickable-follow" onClick={() => { setModalType('followers'); setModalVisible(true); }}>
  <span>Followers</span>
  <strong>{followers.length}</strong>
</div>


          </div>
          <div className="follow-stat">
          <div className="clickable-follow" onClick={() => { setModalType('following'); setModalVisible(true); }}>
  <span>Following</span>
  <strong>{following.length}</strong>
</div>


          </div>
        </div>

        <div className="bio">
          ✍️ {userData?.bio || 'No bio available'}
        </div>
      </div>

      <button className="add-post-btn" onClick={() => navigate('/CreatePostWeb')}>
  <FaPlus size={16} /> Add Post
</button>


      <div className="post-list">
        {posts.map(renderPostItem)}
      </div>

      {modalVisible && (
        <div className="modal-overlay" onClick={() => setModalVisible(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{modalType === 'followers' ? 'Followers' : 'Following'}</h3>
            {modalType === 'followers'
              ? followers.map(renderUserItem)
              : following.map(renderUserItem)}
            <button onClick={() => setModalVisible(false)} className="close-modal">Close</button>
          </div>
        </div>
      )}
    </div>
    </>

  );
};

export default FollowingScreen;
