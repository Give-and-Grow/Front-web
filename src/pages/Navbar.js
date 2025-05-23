import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../images/volunter1.jpg';
import './Navbar.css';

import { FiHome, FiUser, FiFileText, FiBriefcase, FiInfo, FiPhone, FiUsers, FiSettings, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // تعريف دالة لفحص الروابط النشطة، مع التحقق من صفحات الفرص
  const isActiveLink = (linkTo) => {
    if (linkTo === '/ApplicationsScreen') {
      // هنا تضع كل المسارات المتعلقة بالفرص
      const opportunitiesPaths = [
        '/ApplicationsScreen',
        '/AllOppertinitesUser',
        '/NearbyOpportunitiesUser',
        '/JobOpportunities',
        '/VolunteerOpportunities',
      ];
      return opportunitiesPaths.some(path => location.pathname.startsWith(path));
    }

    if (linkTo === '/manage-opportunities') {
      const manageOpportunitiesPaths = [
        '/manage-opportunities',
        '/manage-opportunities/details',
        '/manage-opportunities/edit',
      ];
      return manageOpportunitiesPaths.some(path => location.pathname.startsWith(path));
    }

    // لأي رابط آخر نقارن مباشرة
    return location.pathname === linkTo;
  };

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
    { to: '/manage-opportunities', icon: <FiBriefcase />, label: 'Manage Opportunities' },
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
        {linksToRender.map((link) => (
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
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
