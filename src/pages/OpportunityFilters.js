import React, { useState } from 'react';
import { FaList, FaMapMarkerAlt, FaBriefcase, FaRegStar, FaUsers, FaStar } from 'react-icons/fa';

const iconMap = {
  'format-list-bulleted': <FaList size={16} />,
  'map-marker-radius': <FaMapMarkerAlt size={16} />,
  'briefcase-check': <FaBriefcase size={16} />,
  'account-star': <FaRegStar size={16} />,
  'star-circle-outline': <FaStar size={16} />,
  'account-multiple-outline': <FaUsers size={16} />,
};

const OpportunityFilters = ({ onFilterSelect = () => {}, initialFilter = 'All' }) => {
  const [selected, setSelected] = useState(initialFilter);

  const filters = [
    { label: 'All Opportunities', value: 'All', screen: 'AllOppertinitesUser', icon: 'format-list-bulleted' },
    { label: 'Nearby Opportunities', value: 'Nearby', screen: 'nearby_opportunitiesUser', icon: 'map-marker-radius' },
    { label: 'Best Fit Jobs', value: 'Jobs', screen: 'JobOpportunities', icon: 'briefcase-check' },
    { label: 'Best Fit Volunteering', value: 'Volunteer', screen: 'VolunterOpprtunities', icon: 'account-star' },
    { label: 'Evaluate Opportunities', value: 'Eval', screen: 'ApplicationsScreen', icon: 'star-circle-outline' },
    { label: 'Similar to You', value: 'Similar', screen: 'CFSimilarOpportunities', icon: 'account-multiple-outline' },
  ];

  const handleSelect = (value, screen) => {
    setSelected(value);
    onFilterSelect(value, screen);
  };

  return (
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
          >
            <span
              style={{
                ...styles.icon,
                color: selected === filter.value ? 'white' : '#2e7d32',
                verticalAlign: 'middle',
                display: 'inline-flex',
              }}
            >
              {iconMap[filter.icon]}
            </span>
            <span
              style={{
                ...styles.filterText,
                ...(selected === filter.value ? styles.selectedText : {}),
                verticalAlign: 'middle',
                marginLeft: 6,
              }}
            >
              {filter.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '10px 0',
    backgroundColor: '#e8f5e9',
  },
  scrollContainer: {
    display: 'flex',
    overflowX: 'auto',
    paddingLeft: 10,
  },
  filterButton: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#c8e6c9',
    borderRadius: 20,
    border: 'none',
    padding: '8px 15px',
    margin: '0 5px',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
    color: '#2e7d32',
    userSelect: 'none',
  },
  selectedFilter: {
    backgroundColor: '#388e3c',
    color: 'white',
  },
  filterText: {
    color: '#2e7d32',
  },
  selectedText: {
    color: 'white',
  },
  icon: {},
};

export default OpportunityFilters;
