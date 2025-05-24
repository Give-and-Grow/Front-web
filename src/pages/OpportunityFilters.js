import React, { useState } from 'react';
import { FaList, FaMapMarkerAlt, FaBriefcase, FaRegStar, FaUsers, FaStar } from 'react-icons/fa';
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
  const navigate = useNavigate();

  const filters = [
    { label: 'All Opportunities', value: 'All', screen: '/AllOppertinitesUser', icon: 'format-list-bulleted' },
    { label: 'Nearby Opportunities', value: 'Nearby', screen: '/NearbyOpportunitiesUser', icon: 'map-marker-radius' },
    { label: 'Best Fit Jobs', value: 'Jobs', screen: '/JobOpportunities', icon: 'briefcase-check' },
    { label: 'Best Fit Volunteering', value: 'Volunteer', screen: '/VolunteerOpportunities', icon: 'account-star' },
    { label: 'Evaluate Opportunities', value: 'Eval', screen: '/ApplicationsScreen', icon: 'star-circle-outline' },
    // { label: 'Similar to You', value: 'Similar', screen: '/CFSimilarOpportunities', icon: 'account-multiple-outline' },
  ];

  const handleSelect = (value, screen) => {
    setSelected(value);
    onFilterSelect(value, screen);
    navigate(screen);
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
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
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#c8e6c9',
    borderRadius: 30,
    border: 'none',
    padding: '10px 20px',
    margin: '0 8px',
    cursor: 'pointer',
    fontSize: 15,
    fontWeight: 600,
    color: '#2e7d32',
    userSelect: 'none',
    boxShadow: '0 2px 6px rgba(46, 125, 50, 0.2)',
    transition: 'all 0.25s ease-in-out',
    minWidth: 140,
  },
  selectedFilter: {
    backgroundColor: '#388e3c',
    color: 'white',
    boxShadow: '0 4px 12px rgba(56, 142, 60, 0.6)',
    transform: 'scale(1.05)',
  },
  filterText: {
    color: '#2e7d32',
    marginLeft: 10,
    whiteSpace: 'nowrap',
  },
  selectedText: {
    color: 'white',
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
  },
};

export default OpportunityFilters;
