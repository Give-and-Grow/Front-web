import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../pages/Navbar';
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  IconButton,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Box,
  CircularProgress,
} from '@mui/material';
import FriendSuggestions from '../components/FriendSuggestions';
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaSyncAlt,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaUsers,
  FaUser,
} from 'react-icons/fa';
import AdComponent from '../components/AdComponent';

const FrindsPost = () => {
  const [activeTab, setActiveTab] = useState('my');
  const [myPosts, setMyPosts] = useState([]);
  const [friendsPosts, setFriendsPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [followStatus, setFollowStatus] = useState({}); // New state for follow status

  useEffect(() => {
    const getTokenAndFetch = async () => {
      const savedToken = localStorage.getItem('userToken');
      if (savedToken) {
        setToken(savedToken);
        await fetchMyPosts(savedToken);
        await fetchFriendsPosts(savedToken);
      }
    };
    getTokenAndFetch();
  }, []);

  const fetchMyPosts = async (authToken) => {
    const usedToken = authToken || token;
    if (!usedToken) return;
    try {
      const res = await axios.get(`http://localhost:5000/posts/`, {
        headers: { Authorization: `Bearer ${usedToken}` },
      });
      setMyPosts(res.data || []);
    } catch (err) {
      console.error('Posts error:', err);
    }
  };

  const fetchFriendsPosts = async (authToken) => {
    const usedToken = authToken || token;
    if (!usedToken) return;
    try {
      const res = await axios.get(`http://localhost:5000/posts/following`, {
        headers: { Authorization: `Bearer ${usedToken}` },
      });
      setFriendsPosts(res.data);
    } catch (err) {
      console.error('Error fetching friends posts:', err);
    }
  };

  const onRefresh = () => {
    if (!token) return;
    setLoading(true);
    Promise.all([fetchMyPosts(token), fetchFriendsPosts(token)]).finally(() => setLoading(false));
  };

  useEffect(() => {
    onRefresh();
  }, []);

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
        // alert('Followed successfully');
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
        // alert('Unfollowed successfully');
      }
    } catch (err) {
      console.error('Unfollow error:', err);
      alert('Unfollow failed');
    }
  };

  const displayedPosts = activeTab === 'my' ? myPosts : friendsPosts;

  return (
    <>
      <Navbar />
      <AdComponent />
      <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(e, val) => setActiveTab(val)}
          textColor="success"
          indicatorColor="success"
          centered
          sx={{ marginBottom: 2 }}
        >
          <Tab icon={<FaUser size={20} />} label="My Posts" value="my" />
          <Tab icon={<FaUsers size={20} />} label="Friends' Posts" value="friends" />
          <IconButton onClick={onRefresh} color="success" aria-label="refresh posts">
            <FaSyncAlt />
          </IconButton>
        </Tabs>

        {/* FriendSuggestions Component */}
        <FriendSuggestions
          token={token}
          followStatus={followStatus}
          setFollowStatus={setFollowStatus}
          handleFollow={handleFollow}
          handleUnfollow={handleUnfollow}
        />

        {loading && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}

        {!loading && displayedPosts.length === 0 && (
          <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
            No posts found
          </Typography>
        )}

        {!loading &&
          displayedPosts.map((item) => <PostCard key={item.post_id || item.id} item={item} />)}
      </Box>
    </>
  );
};

function PostCard({ item }) {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');

  const token = localStorage.getItem('userToken');

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const fetchComments = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`http://localhost:5000/posts/${item.post_id}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(res.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const toggleComments = () => {
    if (!showComments) fetchComments();
    setShowComments(!showComments);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await axios.post(
        `http://localhost:5000/posts/${item.post_id}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleDeleteComment = async (comment_id) => {
    try {
      await axios.delete(`http://localhost:5000/posts/${item.post_id}/comments/${comment_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComments();
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const handleEditComment = (comment_id, currentContent) => {
    setEditingCommentId(comment_id);
    setEditingCommentContent(currentContent);
  };

  const submitEditComment = async () => {
    try {
      await axios.put(
        `http://localhost:5000/posts/${item.post_id}/comments/${editingCommentId}`,
        { content: editingCommentContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingCommentId(null);
      setEditingCommentContent('');
      fetchComments();
    } catch (err) {
      console.error('Error editing comment:', err);
    }
  };

  return (
    <Card sx={{ mb: 2 }} elevation={3}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: '#66bb6a' }}>
            {item.title?.[0]?.toUpperCase() || '?'}
          </Avatar>
        }
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" component="div" color="#66bb6a">
              {item.title}
            </Typography>
          </Box>
        }
        subheader={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {(item.owner_info?.profile_picture || item.user?.profile_picture) && (
              <Avatar
                src={item.owner_info?.profile_picture || item.user?.profile_picture}
                alt="profile"
                sx={{ width: 30, height: 30 }}
              />
            )}
            <Typography variant="body2" color="textSecondary">
              By: {item.owner_info?.name || item.user?.name || 'Unknown'}
            </Typography>
            <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
              {formatDateTime(item.created_at)}
            </Typography>
          </Box>
        }
      />

      {item.content && (
        <CardContent>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {item.content}
          </Typography>

          {item.images && item.images.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                mb: 2,
                alignItems: 'center',
              }}
            >
              {item.images.map((imgUrl, index) => (
                <Box
                  key={index}
                  sx={{
                    maxHeight: 300,
                    overflow: 'hidden',
                    borderRadius: 2,
                    boxShadow: 1,
                    bgcolor: '#f5f5f5',
                    width: '80%',
                  }}
                >
                  <img
                    src={imgUrl}
                    alt={`Post Image ${index + 1}`}
                    style={{ width: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', padding: 1, gap: 2 }}>
        <IconButton onClick={() => setLiked(!liked)} color={liked ? 'error' : 'default'}>
          {liked ? <FaHeart color="red" /> : <FaRegHeart />}
        </IconButton>

        <IconButton onClick={toggleComments} color="success">
          <FaComment />
        </IconButton>
      </Box>

      {showComments && (
        <Box sx={{ px: 2, pb: 2 }}>
          {comments.map((comment) => (
            <Box
              key={comment.id}
              sx={{
                borderBottom: '1px solid #ddd',
                py: 1,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {comment.owner_info?.profile_picture && (
                    <Avatar
                      src={comment.owner_info.profile_picture}
                      alt="commenter"
                      sx={{ width: 30, height: 30 }}
                    />
                  )}
                  <Typography variant="body2" fontWeight="bold">
                    {comment.owner_info?.name || 'Unknown User'}:
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  {comment.is_mine && editingCommentId !== comment.id && (
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => handleEditComment(comment.id, comment.content)}
                    >
                      <FaEdit />
                    </IconButton>
                  )}
                  {(comment.is_mine || comment.is_post_owner) && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <FaTrash />
                    </IconButton>
                  )}
                </Box>
              </Box>

              {editingCommentId === comment.id ? (
                <Box sx={{ mt: 1 }}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    variant="outlined"
                    value={editingCommentContent}
                    onChange={(e) => setEditingCommentContent(e.target.value)}
                    sx={{ mb: 1 }}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<FaCheck />}
                      onClick={submitEditComment}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<FaTimes />}
                      onClick={() => setEditingCommentId(null)}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>
                  {comment.content}
                </Typography>
              )}
            </Box>
          ))}

          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button
              variant="contained"
              color="success"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              Post
            </Button>
          </Box>
        </Box>
      )}
    </Card>
  );
}

export default FrindsPost;