import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiLock, FiUnlock, FiRefreshCw } from 'react-icons/fi';
import ChatBox from './ChatBox'; // Import ChatBox
import './ChatList.css';

const ChatList = ({ onSelectChat, userRole }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const userToken = localStorage.getItem('userToken');

  const fetchChats = async () => {
    try {
      setLoading(true);
      const endpoint = userRole === 'organization' 
        ? 'http://localhost:5000/chat/my-organization-chats' 
        : 'http://localhost:5000/chat/my-user-chats';
      
      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      
      const sortedChats = res.data.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      
      setChats(sortedChats);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch chats.');
      setLoading(false);
      console.error('Error fetching chats:', err);
    }
  };

  useEffect(() => {
    if (userToken) {
      fetchChats();
    } else {
      setError('Please log in to view chats.');
      setLoading(false);
    }
  }, [userRole, userToken]);

  const handleRefresh = () => {
    fetchChats();
  };

 const handleChatClick = (chat) => {
  setSelectedChat({ opportunityId: chat.opportunity_id, isLocked: chat.is_locked });
  onSelectChat({ opportunityId: chat.opportunity_id, isLocked: chat.is_locked });
};

  const handleCloseChat = () => {
    setSelectedChat(null);
  };

  if (loading) {
    return <div className="chat-list-loading">Loading...</div>;
  }

  if (error) {
    return <div className="chat-list-error">{error}</div>;
  }

  return (
    <div className="chat-list-container">
      <div className="chat-list-header">
        <h2 className="chat-list-title">Chats</h2>
        <button className="refresh-button" onClick={handleRefresh} title="Refresh">
          <FiRefreshCw size={16} />
        </button>
      </div>
      {chats.length === 0 ? (
        <p className="no-chats">No chats available.</p>
      ) : (
        <ul className="chat-list">
          {chats.map((chat) => (
            <li 
              key={chat.chat_id} 
              className={`chat-item ${selectedChat === chat.opportunity_id ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleChatClick(chat);
              }}
            >
              <div className="chat-item-content">
                <div className="chat-item-header">
                  <h3 className="chat-title">{chat.opportunity_title}</h3>

                  {/* 🔒 زر القفل للمؤسسة فقط */}
                  {userRole === 'organization' && (
                    <button
                      className="lock-button"
                      onClick={async (e) => {
                        e.stopPropagation(); // ما يفتح الشات
                        const endpoint = chat.is_locked
                          ? `http://localhost:5000/chat/unlock-chat/${chat.opportunity_id}`
                          : `http://localhost:5000/chat/lock-chat/${chat.opportunity_id}`;
                        try {
                          const res = await axios.put(endpoint, null, {
                            headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
                          });
                          // عدّل حالة القفل محليًا:
                          setChats(prev => prev.map(c => 
                            c.chat_id === chat.chat_id 
                              ? { ...c, is_locked: !c.is_locked }
                              : c
                          ));
                        } catch (err) {
                          console.error("Failed to toggle chat lock", err);
                        }
                      }}
                      title={chat.is_locked ? "Unlock Chat" : "Lock Chat"}
                    >
                      {chat.is_locked ? <FiLock size={18} /> : <FiUnlock size={18} />}
                    </button>
                  )}
                </div>
                <p className="chat-date">
                  {new Date(chat.created_at).toLocaleString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </p>
              </div>
            </li>
          ))}

        </ul>
      )}
      {}
    </div>
  );
};

export default ChatList;