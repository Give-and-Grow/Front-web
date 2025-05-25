import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../images/volunter1.jpg';
import './Navbar.css';

import { 
  FiHome, FiUser, FiFileText, FiBriefcase, FiInfo, FiPhone, FiUsers, FiSettings, FiMenu, FiX 
} from 'react-icons/fi';

import { 
  MdVolunteerActivism, MdWork, MdStarRate, MdList, MdGroupAdd, MdEventAvailable 
} from 'react-icons/md';

const Navbar = () => {
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [manageDropdownOpen, setManageDropdownOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleManageDropdown = () => {
    setManageDropdownOpen(!manageDropdownOpen);
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
      return opportunitiesPaths.some(path => location.pathname.startsWith(path));
    }
    if (linkTo === '/RateParticipantsScreen') {
      const manageOpportunitiesPaths = [
        '/manage-opportunities',
        '/CreatevolunterOpportunity',
        '/CreateJobOpportunity',
        '/RateParticipantsScreen',
        '/OpportunityList',
        '/OrganizationRejectAcceptUser',
        '/AttendanceScreen'
      ];
      return manageOpportunitiesPaths.some(path => location.pathname.startsWith(path));
    }
    return location.pathname === linkTo;
  };

  const manageOpportunitiesSubmenu = [
    { label: 'Add Volunteer Opportunity', value: 'add_volunteer', screen: '/CreatevolunterOpportunity', icon: <MdVolunteerActivism /> },
    { label: 'Add Job Opportunity', value: 'add_job', screen: '/CreateJobOpportunity', icon: <MdWork /> },
    { label: 'Evaluate Participants', value: 'evaluate', screen: '/RateParticipantsScreen', icon: <MdStarRate /> },
    { label: 'List All Opportunities', value: 'list_all', screen: '/OpportunityList', icon: <MdList /> },
    { label: 'Manage Participants', value: 'manage_participants', screen: '/OrganizationRejectAcceptUser', icon: <MdGroupAdd /> },
    { label: 'Attendance', value: 'attendance', screen: '/AttendanceScreen', icon: <MdEventAvailable /> },
  ];

  const userLinks = [
    { to: '/Homepage', icon: <FiHome />, label: 'Home' },
    { to: '/FollowingScreen', icon: <FiUser />, label: 'Profile' },
    { to: '/FriendsPost', icon: <FiFileText />, label: 'Posts' },
    { to: '/ApplicationsScreen', icon: <FiBriefcase />, label: 'Opportunities' },
    { to: '/about', icon: <FiInfo />, label: 'About' },
    { to: '/contact', icon: <FiPhone />, label: 'Contact' },
  ];

  const organizationLinks = [
    { to: '/Homepage', icon: <FiHome />, label: 'Home' },
    { to: '/FollowScreenOrganization', icon: <FiUser />, label: 'Profile' },
    { to: '/FriendsPost', icon: <FiFileText />, label: 'Posts' },
    { to: '#', icon: <FiBriefcase />, label: 'Manage Opportunities', isDropdown: true },
    { to: '/about', icon: <FiInfo />, label: 'About' },
    { to: '/contact', icon: <FiPhone />, label: 'Contact' },
  ];

  const adminLinks = [
    { to: '/Homepage', icon: <FiHome />, label: 'Home' },
    { to: '/admin-dashboard', icon: <FiBriefcase />, label: 'Dashboard' },
    { to: '/manage-users', icon: <FiUsers />, label: 'Users' },
    { to: '/reports', icon: <FiFileText />, label: 'Reports' },
    { to: '/profile', icon: <FiSettings />, label: 'Profile' },
  ];

  let linksToRender = [];

  if (userRole === 'admin') {
    linksToRender = adminLinks;
  } else if (userRole === 'organization') {
    linksToRender = organizationLinks;
  } else {
    linksToRender = userLinks;
  }

  return (
    <nav className="navbar fixed-navbar">
      <div className="navbar-header">
        <img src={logo} alt="logo" className="logo" />
        <button className="menu-toggle" onClick={toggleMenu}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        {linksToRender.map((link) => {
          if (link.isDropdown) {
            return (
              <li key={link.label} className={`dropdown ${manageDropdownOpen ? 'open' : ''}`}>
                <button
                  className="dropdown-toggle"
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
                      <li key={item.value} onClick={() => { setMenuOpen(false); setManageDropdownOpen(false); }}>
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
      </ul>
    </nav>
  );
};

export default Navbar;
