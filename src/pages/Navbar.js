import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import logo from '../images/hands.png';
import {
  FiHome,
  FiUser,
  FiFileText,
  FiBriefcase,
  FiInfo,
  FiPhone,
  FiUsers,
  FiSettings,
  FiMenu,
  FiX,
  FiLogOut,
  FiMessageSquare,
} from 'react-icons/fi';
import {
  MdVolunteerActivism,
  MdWork,
  MdStarRate,
  MdList,
  MdGroupAdd,
  MdEventAvailable,
} from 'react-icons/md';
import ChatList from '../components/ChatList';
import ChatBox from '../components/ChatBox';
import Notification from './Notification'; // Import the new Notification component
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [manageDropdownOpen, setManageDropdownOpen] = useState(false);
  const [showChats, setShowChats] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [userToken, setUserToken] = useState(localStorage.getItem('userToken'));

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const token = localStorage.getItem('userToken');
    setUserRole(role);
    setUserToken(token);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.chat-container')) {
        setShowChats(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        'http://localhost:5000/auth/logout',
        null,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      localStorage.removeItem('userToken');
      localStorage.removeItem('userRole');
      setUserToken(null);
      setUserRole(null);
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (manageDropdownOpen) setManageDropdownOpen(false);
    setShowChats(false);
  };

  const toggleManageDropdown = () => {
    setManageDropdownOpen(!manageDropdownOpen);
    setShowChats(false);
  };

  const toggleChats = (e) => {
    e.stopPropagation();
    setShowChats(!showChats);
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
    { to: '/AdminDashboard', icon: <FiBriefcase />, label: 'Dashboard' },
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
              <Notification userToken={userToken} />
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