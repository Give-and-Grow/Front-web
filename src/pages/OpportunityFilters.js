import React, { useState, useEffect, useRef } from 'react';
import { FaList, FaMapMarkerAlt, FaBriefcase, FaRegStar, FaUsers, FaStar, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const iconMap = {
  'format-list-bulleted': <FaList size={18} />,
  'map-marker-radius': <FaMapMarkerAlt size={18} />,
  'briefcase-check': <FaBriefcase size={18} />,
  'account-star': <FaRegStar size={18} />,
  'star-circle-outline': <FaStar size={18} />,
  'account-multiple-outline': <FaUsers size={18} />,
};

const OpportunityFilters = ({ onFilterSelect = () => {}, initialFilter = 'All' }) => {
  const [selected, setSelected] = useState(initialFilter);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const filters = [
    { label: 'All Opportunities', value: 'All', screen: '/AllOppertinitesUser', icon: 'format-list-bulleted' },
    { label: 'Nearby Opportunities', value: 'Nearby', screen: '/NearbyOpportunitiesUser', icon: 'map-marker-radius' },
    { label: 'Best Fit Jobs', value: 'Jobs', screen: '/JobOpportunities', icon: 'briefcase-check' },
    { label: 'Best Fit Volunteering', value: 'Volunteer', screen: '/VolunteerOpportunities', icon: 'account-star' },
    { label: 'Evaluate Opportunities', value: 'Eval', screen: '/ApplicationsScreen', icon: 'star-circle-outline' },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
      if (window.innerWidth >= 600) {
        setMenuOpen(false); // اقفل المنيو لما نرجع للديسكتوب
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelect = (value, screen) => {
    setSelected(value);
    onFilterSelect(value, screen);
    navigate(screen);
    setMenuOpen(false); // اقفل المنيو بعد الاختيار
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        {isMobile ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              style={styles.menuButton}
              aria-haspopup="true"
              aria-expanded={menuOpen}
              aria-label="Toggle filters menu"
            >
              <FaBars size={24} color="#2e7d32" />
            </button>
            {menuOpen && (
              <div style={styles.dropdownMenu}>
                {filters.map(filter => (
                  <button
                    key={filter.value}
                    onClick={() => handleSelect(filter.value, filter.screen)}
                    style={{
                      ...styles.dropdownItem,
                      backgroundColor: selected === filter.value ? '#388e3c' : '#c8e6c9',
                      color: selected === filter.value ? 'white' : '#2e7d32',
                    }}
                  >
                    <span style={{ marginRight: 8 }}>{iconMap[filter.icon]}</span>
                    {filter.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={styles.scrollContainer}>
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => handleSelect(filter.value, filter.screen)}
                style={{
                  ...styles.filterButton,
                  ...(selected === filter.value ? styles.selectedFilter : {}),
                }}
                aria-pressed={selected === filter.value}
                title={filter.label}
              >
                <span
                  style={{
                    ...styles.icon,
                    color: selected === filter.value ? '#fff' : '#2e7d32',
                  }}
                >
                  {iconMap[filter.icon]}
                </span>
                <span
                  style={{
                    ...styles.filterText,
                    ...(selected === filter.value ? styles.selectedText : {}),
                  }}
                >
                  {filter.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const styles = {
  container: {
    padding: '14px 0',
    backgroundColor: '#e8f5e9',
    boxShadow: 'inset 0 -1px 3px rgba(0,0,0,0.1)',
  },
  scrollContainer: {
    display: 'flex',
    overflowX: 'auto',
    paddingLeft: 12,
    scrollbarWidth: 'thin',
    scrollbarColor: '#81c784 transparent',
  },
  filterButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c8e6c9',
    borderRadius: 30,
    border: 'none',
    padding: '8px 12px', 
    margin: '0 6px',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    color: '#2e7d32',
    userSelect: 'none',
    boxShadow: '0 2px 6px rgba(46, 125, 50, 0.2)',
    transition: 'all 0.25s ease-in-out',
    minWidth: 100,
    maxWidth: 160,
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    overflow: 'hidden',
  },
  selectedFilter: {
    backgroundColor: '#388e3c',
    color: 'white',
    boxShadow: '0 4px 12px rgba(56, 142, 60, 0.6)',
    transform: 'scale(1.05)',
  },
  filterText: {
    color: '#2e7d32',
    marginLeft: 8,
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    textAlign: 'center',
    flexShrink: 1,
  },
  selectedText: {
    color: 'white',
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
  },
  menuButton: {
    backgroundColor: '#c8e6c9',
    border: 'none',
    padding: '8px 12px',
    borderRadius: 30,
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(46, 125, 50, 0.2)',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '48px',
    right: 0,
    backgroundColor: '#c8e6c9',
    borderRadius: 12,
    boxShadow: '0 4px 12px rgba(46,125,50,0.3)',
    padding: 8,
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
    minWidth: 180,
  },
  dropdownItem: {
    backgroundColor: '#c8e6c9',
    border: 'none',
    padding: '10px 14px',
    borderRadius: 12,
    margin: '4px 0',
    cursor: 'pointer',
    textAlign: 'left',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.2s ease',
  },
};

export default OpportunityFilters;
