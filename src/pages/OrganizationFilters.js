import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdVolunteerActivism, MdWork, MdStarRate, MdList,
  MdGroupAdd, MdEventAvailable, MdMenu
} from 'react-icons/md';
//import './OrganizationFilters.css';

const OrganizationFilters = ({ initialFilter = null, onFilterSelect }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(initialFilter);
  const [isOpen, setIsOpen] = useState(false);

  const filters = [
    { label: 'Add Volunteer Opportunity', value: 'add_volunteer', screen: '/CreatevolunterOpportunity', icon: <MdVolunteerActivism /> },
    { label: 'Add Job Opportunity', value: 'add_job', screen: '/CreateJobOpportunity', icon: <MdWork /> },
    { label: 'Evaluate Participants', value: 'evaluate', screen: '/RateParticipantsScreen', icon: <MdStarRate /> },
    { label: 'List All Opportunities', value: 'list_all', screen: '/OpportunityList', icon: <MdList /> },
    { label: 'Manage Participants', value: 'manage_participants', screen: '/OrganizationRejectAcceptUser', icon: <MdGroupAdd /> },
    { label: 'Attendance', value: 'attendance', screen: '/AttendanceScreen', icon: <MdEventAvailable /> },
  ];

  const handleSelect = (value, screen) => {
    setSelected(value);
    onFilterSelect?.(value);
    navigate(screen);
    setIsOpen(false); // اغلق القائمة بعد الاختيار
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="menu-toggle" onClick={toggleMenu}>
        <MdMenu size={24} />
      </div>

      {isOpen && (
        <div className="sidebar-menu">
          {filters.map((filter) => (
            <div
              key={filter.value}
              className={`menu-item ${selected === filter.value ? 'active' : ''}`}
              onClick={() => handleSelect(filter.value, filter.screen)}
            >
              <div className="menu-icon">{filter.icon}</div>
              <div className="menu-label">{filter.label}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default OrganizationFilters;
