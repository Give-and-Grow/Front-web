import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import logo from '../images/hands.png';
import {FiBell,FiHome,FiUser,FiFileText,FiBriefcase,FiInfo,FiPhone,FiUsers,FiSettings,FiMenu,FiX,FiLogOut,FiMessageSquare,
} from 'react-icons/fi';
import {MdVolunteerActivism,MdWork,MdStarRate,MdList,MdGroupAdd,MdEventAvailable,
} from 'react-icons/md';
import ChatList from '../components/ChatList';
import ChatBox from '../components/ChatBox'; // Import the ChatBox component
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [manageDropdownOpen, setManageDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChats, setShowChats] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const res = await axios.get(
          'http://localhost:5000/notifications/list',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setNotifications(res.data);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    const fetchUnseenCount = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const res = await axios.get(
          'http://localhost:5000/notifications/unseen-count',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUnseenCount(res.data.unseen_count);
      } catch (err) {
        console.error('Failed to fetch unseen notification count', err);
      }
    };
    fetchUnseenCount();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest('.notification-container') &&
        !e.target.closest('.chat-container')
      ) {
        setShowNotifications(false);
        setSelectedNotification(null);
        setShowChats(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.post('http://localhost:5000/auth/logout', null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem('userToken');
      localStorage.removeItem('userRole');
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const markNotificationAsSeen = async (notificationId) => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.post(
        'http://localhost:5000/notifications/mark-seen',
        { notification_id: notificationId },
        { headers: { Authorization: `Bearer ${token}` } }
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
      const token = localStorage.getItem('userToken');
      const res = await axios.post(
        'http://localhost:5000/notifications/mark-all-seen',
        null,
        { headers: { Authorization: `Bearer ${token}` } }
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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (manageDropdownOpen) setManageDropdownOpen(false);
    setShowNotifications(false);
    setShowChats(false);
  };

  const toggleManageDropdown = () => {
    setManageDropdownOpen(!manageDropdownOpen);
    setShowNotifications(false);
    setShowChats(false);
  };

  const toggleChats = (e) => {
    e.stopPropagation();
    setShowChats(!showChats);
    setShowNotifications(false);
    setSelectedNotification(null);
  };

  const isActiveLink = (linkTo) => {
    if (linkTo === '/ApplicationsScreen') {
      const opportunitiesPaths = [
        '/ApplicationsScreen',
        '/AllOppertinitesUser',
        '/NearbyOpportunitiesUser',
        '/JobOpportunities',
        '/VolunteerOpportunities',
      ];
      return opportunitiesPaths.some((path) =>
        location.pathname.startsWith(path)
      );
    }
    if (linkTo === '/manage-opportunities' || linkTo === '#') {
      const manageOpportunitiesPaths = [
        '/manage-opportunities',
        '/manage-opportunities/details',
        '/manage-opportunities/edit',
        '/CreatevolunterOpportunity',
        '/CreateJobOpportunity',
        '/RateParticipantsScreen',
        '/OpportunityList',
        '/OrganizationRejectAcceptUser',
        '/AttendanceScreen',
      ];
      return manageOpportunitiesPaths.some((path) =>
        location.pathname.startsWith(path)
      );
    }
    return location.pathname === linkTo;
  };

  const userLinks = [
    { to: '/Homepage', icon: <FiHome />, label: 'Home' },
    { to: '/FollowingScreen', icon: <FiUser />, label: 'Profile' },
    { to: '/FriendsPost', icon: <FiFileText />, label: 'Posts' },
    {
      to: '/AllOppertinitesUser',
      icon: <FiBriefcase />,
      label: 'Opportunities',
    },
  ];

  const organizationLinks = [
    { to: '/Homepage', icon: <FiHome />, label: 'Home' },
    { to: '/FollowScreenOrganization', icon: <FiUser />, label: 'Profile' },
    { to: '/FriendsPost', icon: <FiFileText />, label: 'Posts' },
    {
      to: '#',
      icon: <FiBriefcase />,
      label: 'Opportunities',
      isDropdown: true,
    },
  ];

  const adminLinks = [
    { to: '/Homepage', icon: <FiHome />, label: 'Home' },
    { to: '/admin-dashboard', icon: <FiBriefcase />, label: 'Dashboard' },
    { to: '/manage-users', icon: <FiUsers />, label: 'Users' },
    { to: '/reports', icon: <FiFileText />, label: 'Reports' },
    { to: '/profile', icon: <FiSettings />, label: 'Profile' },
  ];

  const manageOpportunitiesSubmenu = [
    {
      label: 'Add Volunteer Opportunity',
      value: 'add_volunteer',
      screen: '/CreatevolunterOpportunity',
      icon: <MdVolunteerActivism />,
    },
    {
      label: 'Add Job Opportunity',
      value: 'add_job',
      screen: '/CreateJobOpportunity',
      icon: <MdWork />,
    },
    {
      label: 'Evaluate Participants',
      value: 'evaluate',
      screen: '/RateParticipantsScreen',
      icon: <MdStarRate />,
    },
    {
      label: 'List All Opportunities',
      value: 'list_all',
      screen: '/OpportunityList',
      icon: <MdList />,
    },
    {
      label: 'Manage Participants',
      value: 'manage_participants',
      screen: '/OrganizationRejectAcceptUser',
      icon: <MdGroupAdd />,
    },
    {
      label: 'Attendance',
      value: 'attendance',
      screen: '/AttendanceScreen',
      icon: <MdEventAvailable />,
    },
  ];

  const userToken = localStorage.getItem('userToken');

  let linksToRender = [];
  if (!userToken) {
    linksToRender = [
      { to: '/Homepage', icon: <FiHome />, label: 'Home' },
      { to: '/About', icon: <FiInfo />, label: 'About' },
      { to: '/Contact', icon: <FiPhone />, label: 'Contact' },
      { to: '/LoginPage', icon: <FiUser />, label: 'Login' },
    ];
  } else if (userRole === 'admin') {
    linksToRender = adminLinks;
  } else if (userRole === 'organization') {
    linksToRender = organizationLinks;
  } else {
    linksToRender = userLinks;
  }

  return (
    <>
      <nav className="navbar fixed-navbar">
        <div className="navbar-header">
          <div className="logo-container">
            <img src={logo} alt="logo" className="logo" />
            <span className="logo-text">Give & Grow</span>
          </div>
          <button className="menu-toggle" onClick={toggleMenu}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {linksToRender.map((link) => {
            if (link.isDropdown) {
              return (
                <li
                  key={link.label}
                  className={`dropdown ${manageDropdownOpen ? 'open' : ''}`}
                >
                  <button
                    className={`dropdown-toggle ${
                      isActiveLink(link.to) ? 'active' : ''
                    }`}
                    onClick={toggleManageDropdown}
                    aria-haspopup="true"
                    aria-expanded={manageDropdownOpen}
                  >
                    <span className="nav-icon">{link.icon}</span>
                    {link.label}
                  </button>
                  {manageDropdownOpen && (
                    <ul className="dropdown-menu">
                      {manageOpportunitiesSubmenu.map((item) => (
                        <li
                          key={item.value}
                          className={isActiveLink(item.screen) ? 'active' : ''}
                          onClick={() => {
                            setMenuOpen(false);
                            setManageDropdownOpen(false);
                          }}
                        >
                          <Link to={item.screen}>
                            <span className="nav-icon">{item.icon}</span>
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }
            return (
              <li
                key={link.to}
                className={isActiveLink(link.to) ? 'active' : ''}
                onClick={() => setMenuOpen(false)}
              >
                <Link to={link.to}>
                  <span className="nav-icon">{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            );
          })}
          {userToken && (
            <>
              <li
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
              >
                <div className="logout-link">
                  <span className="nav-icon">
                    <FiLogOut />
                  </span>
                </div>
              </li>
              <li className="notification-container">
                <div
                  className="nav-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowNotifications(!showNotifications);
                    setSelectedNotification(null);
                    setShowChats(false);
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
                            <strong>From:</strong>{' '}
                            {selectedNotification.from_user_name}
                          </p>
                          <p>
                            <strong>Date:</strong>{' '}
                            {selectedNotification.created_at}
                          </p>
                          <p>
                            <strong>Status:</strong>{' '}
                            {selectedNotification.status}
                          </p>
                          <p>
                            <strong>Type:</strong> {selectedNotification.type}
                          </p>
                          <p>
                            <strong>Opportunity ID:</strong>{' '}
                            {selectedNotification.opportunity_id}
                          </p>
                          <p>
                            <strong>Seen:</strong>{' '}
                            {selectedNotification.seen ? 'Yes' : 'No'}
                          </p>
                        </div>
                      </div>
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
                            className={`notification-item ${
                              notif.seen ? '' : 'unseen'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!notif.seen) {
                                markNotificationAsSeen(notif.id);
                              }
                              setSelectedNotification(notif);
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
              {userRole !== 'admin' && (
                <li className="chat-container">
                  <div className="nav-icon" onClick={toggleChats}>
                    <FiMessageSquare size={20} />
                  </div>
                  {showChats && (
                    <div className="chat-dropdown">
                      <ChatList
                        onSelectChat={(chat) => setSelectedChat(chat)}  
                        userRole={userRole}
                      />
                    </div>
                  )}
                </li>
              )}
            </>
          )}
        </ul>
      </nav>
      {selectedChat && (
        <ChatBox
          opportunityId={selectedChat.opportunityId}
          isLocked={selectedChat.isLocked}
          userRole={userRole}
          onClose={() => setSelectedChat(null)}
        />
      )}
    </>
  );
};

export default Navbar;
