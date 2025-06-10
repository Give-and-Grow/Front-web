import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiBell } from 'react-icons/fi';
import './Navbar.css';

const Notification = ({ userToken }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('http://localhost:5000/notifications/list', {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setNotifications(res.data);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };

    const fetchUnseenCount = async () => {
      try {
        const res = await axios.get(
          'http://localhost:5000/notifications/unseen-count',
          {
            headers: { Authorization: `Bearer ${userToken}` },
          }
        );
        setUnseenCount(res.data.unseen_count);
      } catch (err) {
        console.error('Failed to fetch unseen notification count', err);
      }
    };

    if (userToken) {
      fetchNotifications();
      fetchUnseenCount();
    } else {
      setNotifications([]);
      setUnseenCount(0);
    }
  }, [userToken]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.notification-container')) {
        setShowNotifications(false);
        setSelectedNotification(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const markNotificationAsSeen = async (notificationId) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/notifications/mark-seen',
        { notification_id: notificationId },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      if (res.status === 200) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notif) =>
            notif.id === notificationId ? { ...notif, seen: true } : notif
          )
        );
        setUnseenCount((prevCount) => Math.max(prevCount - 1, 0));
      }
    } catch (err) {
      console.error('Failed to mark notification as seen:', err);
    }
  };

  const markAllNotificationsAsSeen = async () => {
    try {
      const res = await axios.post(
        'http://localhost:5000/notifications/mark-all-seen',
        null,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      if (res.status === 200) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notif) => ({ ...notif, seen: true }))
        );
        setUnseenCount(0);
      }
    } catch (err) {
      console.error('Failed to mark all notifications as seen:', err);
    }
  };

  return (
    <li className="notification-container">
      <div
        className="nav-icon"
        onClick={(e) => {
          e.stopPropagation();
          setShowNotifications(!showNotifications);
          setSelectedNotification(null);
        }}
      >
        <FiBell size={20} />
        {unseenCount > 0 && (
          <span className="notification-count">{unseenCount}</span>
        )}
      </div>
      {showNotifications && (
        <div className="notification-dropdown">
        {selectedNotification ? (
            (() => {
                const supportedTypes = ['opportunity_status', 'discount_code'];
                const notifType = selectedNotification.type;

                if (!supportedTypes.includes(notifType)) {
                return (
                    <div className="notification-details">
                    <button
                        className="back-button"
                        onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNotification(null);
                        }}
                    >
                        Back
                    </button>
                    <p>This type of notification is not supported yet.</p>
                    </div>
                );
                }

                if (notifType === 'opportunity_status') {
                return (
                    <div className="notification-details">
                    <button
                        className="back-button"
                        onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNotification(null);
                        }}
                    >
                        Back
                    </button>
                    <h4>{selectedNotification.title}</h4>
                    <p>{selectedNotification.body}</p>
                    <div className="notification-details-content">
                        <p>
                        <strong>From:</strong> {selectedNotification.from_user_name}
                        </p>
                        <p>
                        <strong>Date:</strong> {selectedNotification.created_at}
                        </p>
                    </div>
                    </div>
                );
                }

                if (notifType === 'discount_code') {
                return (
                    <div className="notification-details">
                    <button
                        className="back-button"
                        onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNotification(null);
                        }}
                    >
                        Back
                    </button>
                    <h4>{selectedNotification.title}</h4>
                    <p>{selectedNotification.body}</p>
                    <div className="notification-details-content">
                        <img
                        src={selectedNotification.img || selectedNotification.data?.img}
                        alt="Discount Visual"
                        style={{ width: '100%', borderRadius: '10px', marginTop: '10px' }}
                        />
                        <p>
                        <strong>From:</strong> {selectedNotification.from_user_name}
                        </p>
                        <p>
                        <strong>Date:</strong> {selectedNotification.created_at}
                        </p>
                    </div>
                    </div>
                );
                }
            })()
            ) : notifications.length === 0 ? (
            <p className="no-notifications">No notifications</p>
            ) : (
            <>
                <button
                className="mark-all-seen-button"
                onClick={(e) => {
                    e.stopPropagation();
                    markAllNotificationsAsSeen();
                }}
                >
                Mark All as Seen
                </button>
                {notifications.map((notif) => (
                <div
                    key={notif.id}
                    className={`notification-item ${notif.seen ? '' : 'unseen'}`}
                    onClick={(e) => {
                    e.stopPropagation();
                    if (!notif.seen) {
                        markNotificationAsSeen(notif.id);
                    }
                    setSelectedNotification({
                        ...notif,
                        ...notif.data, // merge data fields directly
                    });
                    }}
                >
                    <strong>{notif.title}</strong>
                    <p>{notif.body}</p>
                </div>
                ))}
            </>
            )}

        </div>
        )}

    </li>
  );
};

export default Notification;
