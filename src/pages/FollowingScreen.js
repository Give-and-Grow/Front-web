import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaUserCog,
  FaUserCircle,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTools,
  FaStar,
  FaTh,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../pages/Navbar';
import AdComponent from '../components/AdComponent';
import UserEvaluationCard from './UserEvaluationCard';
import FriendSuggestions from '../components/FriendSuggestions';
import './FollowingScreen.css';

const FollowingScreen = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [userData, setUserData] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [posts, setPosts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [activeTab, setActiveTab] = useState('posts');
  const [showSkills, setShowSkills] = useState(true);
  const [followStatus, setFollowStatus] = useState({});

  const toggleSkills = () => setShowSkills((prev) => !prev);

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
      return res.data.length;
    } catch (err) {
      console.error('Posts error:', err);
      return 0;
    }
  };

  const fetchFollowers = async (token) => {
    try {
      const res = await axios.get(`http://localhost:5000/follow/followers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFollowers(res.data);
      res.data.forEach((user) => checkFollowStatus(user.id, token));
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
      res.data.forEach((user) => checkFollowStatus(user.id, token));
    } catch (err) {
      console.error('Following error:', err);
    }
  };

  const checkFollowStatus = async (userId, token) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/follow/${userId}/is-following`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const isFollowing = res.data.is_following;
      setFollowStatus((prev) => ({
        ...prev,
        [userId]: isFollowing,
      }));
    } catch (err) {
      console.error(`Error checking follow status for user ${userId}:`, err);
      setFollowStatus((prev) => ({
        ...prev,
        [userId]: false,
      }));
    }
  };

  const handleFollow = async (userId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/follow/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 200) {
        setFollowStatus((prev) => ({ ...prev, [userId]: true }));
        setFollowing((prev) => [...prev, { id: userId }]);
        //alert('Followed successfully');
      }
    } catch (err) {
      console.error('Follow error:', err);
      alert('Follow failed');
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      const res = await axios.delete(`http://localhost:5000/follow/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        setFollowStatus((prev) => ({ ...prev, [userId]: false }));
        setFollowing((prev) => prev.filter((user) => user.id !== userId));
        //alert('Unfollowed successfully');
      }
    } catch (err) {
      console.error('Unfollow error:', err);
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
          <div className="avatar-placeholder">
            {user.username[0].toUpperCase()}
          </div>
        )}
        <span>{user.username}</span>
      </div>
      {followStatus[user.id] === undefined ? (
        <button className="loading-btn" disabled>
          Loading...
        </button>
      ) : followStatus[user.id] ? (
        <button
          className="unfollow-btn"
          onClick={() => handleUnfollow(user.id)}
        >
          Unfollow
        </button>
      ) : (
        <button className="follow-btn" onClick={() => handleFollow(user.id)}>
          Follow
        </button>
      )}
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
          <span key={i} className="tag">
            #{tag}
          </span>
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

  const skillIcons = {
    'food preparation': '🍲',
  };

  const getSkillIcon = (skillName) => {
    const lower = skillName.toLowerCase();
    for (let key in skillIcons) {
      if (lower.includes(key)) return skillIcons[key];
    }
    return '✨';
  };

  const tabs = [
    { id: 'posts', label: 'Posts', icon: <FaTh /> },
    { id: 'skills', label: 'Skills', icon: <FaTools /> },
    { id: 'evaluation', label: 'Evaluation', icon: <FaStar /> },
  ];

  return (
    <>
      <Navbar />
      <AdComponent />
      <div className="following-screen">
        <div className="profile-header">
          <div className="profile-info">
            {userData?.profile_picture ? (
              <img
                src={userData.profile_picture}
                className="avatar-big"
                alt="Profile"
              />
            ) : (
              <FaUserCircle size={80} className="avatar-placeholder-big" />
            )}
            <h2
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '600',
                fontSize: '1.5rem',
              }}
            >
              {userData?.full_name || 'User'}
              {userData?.identity_verification_status === 'approved' && (
                <span
                  className="verified-status"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: '8px',
                  }}
                >
                  <svg
                    className="verified-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 64 64"
                    fill="none"
                  >
                    <circle
                      cx="32"
                      cy="32"
                      r="30"
                      stroke="#2e7d32"
                      strokeWidth="4"
                      fill="#2e7d32"
                      filter="url(#fancyShadow)"
                    />
                    {[...Array(12)].map((_, i) => {
                      const angle = i * 30 * (Math.PI / 180);
                      const x = 32 + 28 * Math.cos(angle);
                      const y = 32 + 28 * Math.sin(angle);
                      return (
                        <circle key={i} cx={x} cy={y} r="2" fill="#81c784" />
                      );
                    })}
                    <path
                      d="M20 33 L28 41 L44 25"
                      stroke="white"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                    <defs>
                      <filter
                        id="fancyShadow"
                        x="-10"
                        y="-10"
                        width="84"
                        height="84"
                      >
                        <feDropShadow
                          dx="0"
                          dy="0"
                          stdDeviation="3"
                          floodColor="#1b5e20"
                          floodOpacity="0.7"
                        />
                      </filter>
                    </defs>
                  </svg>
                </span>
              )}
            </h2>
            <button
              onClick={() => navigate('/profile')}
              className="edit-profile-btn"
            >
              <FaUserCog size={20} />
            </button>
          </div>

          <div className="follow-stats">
            <div className="follow-stat">
              <div
                className="clickable-follow"
                onClick={() => {
                  setModalType('followers');
                  setModalVisible(true);
                }}
              >
                <span>Followers</span>
                <strong>{followers?.length || 0}</strong>
              </div>
            </div>
            <div className="follow-stat">
              <div
                className="clickable-follow"
                onClick={() => {
                  setModalType('following');
                  setModalVisible(true);
                }}
              >
                <span>Following</span>
                <strong>{following?.length || 0}</strong>
              </div>
            </div>
            <div className="follow-stat">
              <div
                className="clickable-follow"
                onClick={() => {
                  setModalType('posts');
                }}
              >
                <span>Posts</span>
                <strong>{posts?.length || 0}</strong>
              </div>
            </div>
          </div>

          <div className="bio">✍️ {userData?.bio || 'No bio available'}</div>
          <br />

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => navigate('/profile')}>
              <FaUserCog size={20} /> Edit profile
            </button>
            <a
              href={`http://localhost:5000/profile/download_cv/${userData?.account_id}`}
              download
              style={{ textDecoration: 'none' }}
            >
              <button>
                <FaUserCog size={20} /> Download CV
              </button>
            </a>
          </div>
        </div>

        {/* Add FriendSuggestions component here */}
        <FriendSuggestions
          token={token}
          followStatus={followStatus}
          setFollowStatus={setFollowStatus}
          handleFollow={handleFollow}
          handleUnfollow={handleUnfollow}
        />

        <div className="tabs flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn flex-1 py-3 text-center text-sm font-semibold ${
                activeTab === tab.id ? 'font-bold' : ''
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className="flex items-center justify-center gap-2">
                {tab.icon}
                <span className="span">{tab.label}</span>
              </div>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="tab-content mt-6"
          >
            {activeTab === 'skills' && (
              <div className="skills text-center mb-6">
                <h2
                  className="text-2xl font-bold tracking-wide mb-5 flex items-center justify-center gap-2 cursor-pointer hover:opacity-80 transition-opacity duration-200"
                  onClick={toggleSkills}
                >
                  <FaTools className="text-3xl text-green-400" />
                  <span className="text-green-400 underline decoration-dotted">
                    Skills
                  </span>
                </h2>
                {showSkills && (
                  <motion.div
                    className="flex flex-wrap justify-center gap-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    {userData?.skills?.length > 0 ? (
                      userData.skills.map((skill, index) => (
                        <motion.div
                          key={index}
                          whileHover={{
                            scale: 1.1,
                            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                          }}
                          className="flex items-center gap-2 bg-white border-2 border-pink-300 text-gray-800 px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition-transform duration-200"
                        >
                          <span>{skill.name}</span>
                          <span className="text-lg">
                            {getSkillIcon(skill.name)}
                          </span>
                        </motion.div>
                      ))
                    ) : (
                      <span className="text-gray-500 italic">
                        No skills available
                      </span>
                    )}
                  </motion.div>
                )}
              </div>
            )}

            {activeTab === 'evaluation' && (
              <section className="evaluation-section">
                {userData && (
                  <UserEvaluationCard userId={userData.account_id} />
                )}
              </section>
            )}

            {activeTab === 'posts' && (
              <div className="post-list">
                <button
                  className="add-post-btn mb-6"
                  onClick={() => navigate('/CreatePostWeb')}
                >
                  <FaPlus size={16} /> Add Post
                </button>
                {posts?.length > 0 ? (
                  posts.map(renderPostItem)
                ) : (
                  <span className="text-gray-500 italic">
                    No posts available
                  </span>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {modalVisible && (
          <div className="modal-overlay" onClick={() => setModalVisible(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setModalVisible(false)}
                className="close-modal"
              >
                X
              </button>
              <br></br>
              <h3>{modalType === 'followers' ? 'Followers' : 'Following'}</h3>
              {modalType === 'followers'
                ? followers.map(renderUserItem)
                : following.map(renderUserItem)}
              <button
                onClick={() => setModalVisible(false)}
                className="close-modal"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FollowingScreen;
