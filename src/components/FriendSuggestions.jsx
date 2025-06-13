import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUsers } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './FriendSuggestions.css';

const FriendSuggestions = ({ token, followStatus, setFollowStatus, handleFollow, handleUnfollow }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const toggleSuggestions = () => setShowSuggestions((prev) => !prev);

  useEffect(() => {
    if (token) {
      fetchSuggestions(token);
    }
  }, [token]);

  const fetchSuggestions = async (token) => {
    try {
      const res = await axios.get(`http://localhost:5000/follow/recommendations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuggestions(res.data);
      res.data.forEach((user) => checkFollowStatus(user.id, token));
    } catch (err) {
      console.error('Suggestions error:', err);
    }
  };

  const checkFollowStatus = async (userId, token) => {
    try {
      const res = await axios.get(`http://localhost:5000/follow/${userId}/is-following`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  const renderUserItem = (user) => (
    <div className="fs-user-card" key={user.id}>
      <div className="fs-user-info">
        {user.profile_picture ? (
          <img src={user.profile_picture} alt="avatar" className="fs-avatar" />
        ) : (
          <div className="fs-avatar-placeholder">{user.username[0].toUpperCase()}</div>
        )}
        <span>{user.username}</span>
      </div>
      {followStatus[user.id] === undefined ? (
        <button className="fs-loading-btn" disabled>
          Loading...
        </button>
      ) : followStatus[user.id] ? (
        <button className="fs-unfollow-btn" onClick={() => handleUnfollow(user.id)}>
          Unfollow
        </button>
      ) : (
        <button className="fs-follow-btn" onClick={() => handleFollow(user.id)}>
          Follow
        </button>
      )}
    </div>
  );

  return (
    <div className="fs-section">
      <button className="fs-toggle-btn" onClick={toggleSuggestions}>
        <FaUsers size={20} /> {showSuggestions ? 'Hide Friend Suggestions' : 'Show Friend Suggestions'}
      </button>
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            className="fs-list"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {suggestions.length > 0 ? (
              suggestions.map(renderUserItem)
            ) : (
              <span className="text-gray-500 italic">No suggestions available</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FriendSuggestions;
