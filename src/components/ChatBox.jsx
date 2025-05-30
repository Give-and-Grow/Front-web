import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ChatBox.css';

const ChatBox = ({ opportunityId, isLocked, userRole, onClose }) => {
  console.log("ChatBox rendered with opportunityId:", opportunityId, "isLocked:", isLocked, "userRole:", userRole);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userToken = localStorage.getItem('userToken');

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/chat/opportunity/${opportunityId}/messages`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setMessages(res.data.messages || []);
      setLoading(false);
      setTimeout(() => {
        const msgContainer = document.querySelector('.chat-messages');
        if (msgContainer) {
          msgContainer.scrollTop = msgContainer.scrollHeight;
        }
      }, 100); 
    } catch (err) {
      setError('Failed to fetch messages.');
      setLoading(false);
      console.error('Error fetching messages:', err);
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
      fetchMessages(); // Refresh messages after sending
    } catch (err) {
      setError('Failed to send message.');
      console.error('Error sending message:', err);
    }
  };

  useEffect(() => {
    console.log("opportunityId:", opportunityId);
    if (opportunityId) {
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
  {messages.length === 0 ? (
    <p>No messages yet.</p>
  ) : (
    messages.map((msg) => (
      <div key={msg.id} className="message">
        <div className="message-header">
          <img 
            src={msg.sender_profile_picture} 
            alt={msg.sender_name} 
            className="sender-profile-picture" 
          />
          <strong className="sender-name">{msg.sender_name}</strong>
        </div>
        <p className="message-content">{msg.content}</p>
        <span className="message-time">
          {new Date(msg.sent_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
          {msg.is_edited && <em> (edited)</em>}
        </span>
      </div>
    ))
  )}
</div>

      {(userRole === 'organization' || (!isLocked && userRole === 'user')) && (
        <form className="chat-input" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
        </form>
      )}
    </div>
  );
};

export default ChatBox;