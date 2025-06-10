import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ChatBox.css';

const ChatBox = ({ opportunityId, isLocked, userRole, onClose }) => {
  console.log("ChatBox rendered with opportunityId:", opportunityId, "isLocked:", isLocked, "userRole:", userRole);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const userToken = localStorage.getItem('userToken');

  // جلب user_id من /auth/status
  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get('http://localhost:5000/auth/status', {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      console.log('Response from /auth/status:', res.data);
      const userIdMatch = res.data.message.match(/Logged in as (\d+)/);
      if (userIdMatch && userIdMatch[1]) {
        const userId = parseInt(userIdMatch[1]);
        console.log('Extracted currentUserId:', userId, 'Type:', typeof userId);
        setCurrentUserId(userId);
      } else {
        setError('Failed to parse user ID.');
        console.error('Failed to parse user ID from:', res.data.message);
      }
    } catch (err) {
      console.error('Error fetching current user:', err.response?.data || err.message);
      setError('Failed to fetch user data.');
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/chat/opportunity/${opportunityId}/messages`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      console.log('Messages response:', res.data);
      setMessages(res.data.messages || []);
      setLoading(false);
      setTimeout(() => {
        const msgContainer = document.querySelector('.chat-messages');
        if (msgContainer) {
          msgContainer.scrollTop = msgContainer.scrollHeight;
        }
      }, 100);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch messages.');
      console.error('Error fetching messages:', err);
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await axios.post(
        `http://localhost:5000/chat/opportunity/${opportunityId}/send`,
        { message: newMessage },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send message.');
      console.error('Error sending message:', err);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await axios.delete(`http://localhost:5000/chat/opportunity/${opportunityId}/message/${messageId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      fetchMessages();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete message.');
      console.error('Error deleting message:', err);
    }
  };

  const handleEditMessage = async (messageId) => {
    if (!editContent.trim()) {
      setError('Message content cannot be empty.');
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/chat/opportunity/${opportunityId}/message/${messageId}`,
        { new_content: editContent },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      setEditingMessageId(null);
      setEditContent('');
      fetchMessages();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to edit message.');
      console.error('Error editing message:', err);
    }
  };

  const startEditing = (message) => {
    setEditingMessageId(message.id);
    setEditContent(message.content);
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditContent('');
  };

  useEffect(() => {
    console.log("opportunityId:", opportunityId);
    if (opportunityId) {
      fetchCurrentUser();
      fetchMessages();
    }
  }, [opportunityId]);

  useEffect(() => {
    const msgContainer = document.querySelector('.chat-messages');
    if (msgContainer) {
      msgContainer.scrollTop = msgContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-box">
      <div className="chat-box-header">
        <h3>Chat for Opportunity {opportunityId}</h3>
        <button className="close-button" onClick={onClose}>X</button>
      </div>
      <div className="chat-messages">
        {loading ? (
          <p>Loading messages...</p>
        ) : error ? (
          <p className="chat-box-error">{error}</p>
        ) : messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((msg) => {
            console.log('Message user_id:', msg.user_id, 'Type:', typeof msg.user_id, 'Current user_id:', currentUserId, 'Type:', typeof currentUserId, 'Match:', msg.user_id === currentUserId);
            return (
              <div key={msg.id} className={`message ${parseInt(msg.user_id) === currentUserId ? 'own-message' : ''}`}>
                <div className="message-header">
                  <img
                    src={msg.sender_profile_picture || 'default-profile.png'}
                    alt={msg.sender_name}
                    className="sender-profile-picture"
                  />
                  <strong className="sender-name">{msg.sender_name}</strong>
                </div>
                {editingMessageId === msg.id ? (
                  <div className="edit-message">
                    <input
                      type="text"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="Edit your message..."
                    />
                    <button onClick={() => handleEditMessage(msg.id)}>Save</button>
                    <button onClick={cancelEditing}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <p className="message-content">{msg.content}</p>
                    <span className="message-time">
                      {new Date(msg.sent_at).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                      {msg.is_edited && <em> (edited)</em>}
                    </span>
                    {parseInt(msg.user_id) === currentUserId && (
                      <div className="message-actions">
                        <button onClick={() => startEditing(msg)}>Edit</button>
                        <button onClick={() => handleDeleteMessage(msg.id)}>Delete</button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
      {(userRole === 'organization' || (!isLocked && userRole === 'user')) && (
        <form className="chat-input" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={isLocked}
          />
          <button type="submit" disabled={isLocked}>Send</button>
        </form>
      )}
    </div>
  );
};

export default ChatBox;