import React, { useState, useEffect } from 'react';
import './FilterComponent.css';

const FilterComponent = ({ onApplyFilters }) => {
  const initialFilters = {
    status: '',
    opportunity_type: '',
    location: '',
    skill_id: '',
    organization_id: '',
    start_time: '',
    end_time: '',
    volunteer_days: '',
  };

  const [filters, setFilters] = useState(initialFilters);
  const [statusOptions, setStatusOptions] = useState([]);
  const [opportunityTypeOptions, setOpportunityTypeOptions] = useState([]);
  const [weekDaysOptions, setWeekDaysOptions] = useState([]);
  const [skillOptions, setSkillOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);

  // Fetch opportunity statuses
  useEffect(() => {
    fetch('http://127.0.0.1:5000/dropdown/opportunity-statuses')
      .then(res => res.json())
      .then(data => setStatusOptions(data))
      .catch(err => console.error('Failed to fetch status options:', err));
  }, []);

  // Fetch opportunity types
  useEffect(() => {
    fetch('http://localhost:5000/dropdown/opportunity-types')
      .then(res => res.json())
      .then(data => setOpportunityTypeOptions(data))
      .catch(err => console.error('Failed to fetch opportunity types:', err));
  }, []);

  // Fetch week days
  useEffect(() => {
    fetch('http://localhost:5000/dropdown/week-days')
      .then(res => res.json())
      .then(data => setWeekDaysOptions(data))
      .catch(err => console.error('Failed to fetch week days:', err));
  }, []);

  // Fetch skills
  useEffect(() => {
    fetch('http://127.0.0.1:5000/dropdown/skills')
      .then(res => res.json())
      .then(data => {
        const formattedSkills = data.map(skill => ({
          label: skill.label,
          value: skill.value.toString()
        }));
        setSkillOptions(formattedSkills);
      })
      .catch(err => console.error('Failed to fetch skills:', err));
  }, []);

  // Set Palestine cities (English names)
  useEffect(() => {
    const palestineCities = [
      { label: 'Ramallah', value: 'Ramallah' },
      { label: 'Hebron', value: 'Hebron' },
      { label: 'Nablus', value: 'Nablus' },
      { label: 'Bethlehem', value: 'Bethlehem' },
      { label: 'Jenin', value: 'Jenin' },
      { label: 'Tulkarm', value: 'Tulkarm' },
      { label: 'Qalqilya', value: 'Qalqilya' },
      { label: 'Tubas', value: 'Tubas' },
      { label: 'Jericho', value: 'Jericho' },
      { label: 'Rafah', value: 'Rafah' },
      { label: 'Khan Yunis', value: 'Khan Yunis' },
      { label: 'Gaza', value: 'Gaza' },
      { label: 'Salfit', value: 'Salfit' },
      { label: 'Jerusalem', value: 'Jerusalem' },
      { label: 'Dura', value: 'Dura' },
      { label: 'Beit Jala', value: 'Beit Jala' },
      { label: 'Beit Sahour', value: 'Beit Sahour' },
      { label: 'Idhna', value: 'Idhna' },
      { label: 'Yatta', value: 'Yatta' },
      { label: 'Bani Na’im', value: 'Bani Na’im' },
      { label: 'Deir al-Balah', value: 'Deir al-Balah' },
      { label: 'Kufr Qaddum', value: 'Kufr Qaddum' },
      { label: 'Al-Bireh', value: 'Al-Bireh' },
      { label: 'Bethlehem', value: 'Bethlehem' },
      { label: 'Al-Eizariya', value: 'Al-Eizariya' },
    ];
    
    setLocationOptions(
      palestineCities.sort((a, b) => a.label.localeCompare(b.label))
    );
  }, []);

  const handleChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onApplyFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    onApplyFilters(initialFilters);
  };

  const fields = [
    {
      label: 'Status',
      key: 'status',
      options: statusOptions,
    },
    {
      label: 'Opportunity Type',
      key: 'opportunity_type',
      options: opportunityTypeOptions,
    },
    {
      label: 'Location',
      key: 'location',
      options: locationOptions,
    },
    {
      label: 'Skill',
      key: 'skill_id',
      options: skillOptions,
    },
    {
      label: 'Organization',
      key: 'organization_id',
      options: [
        { label: 'Red Crescent', value: '10' },
        { label: 'UNICEF', value: '11' },
        { label: 'Green NGO', value: '12' },
        { label: 'Save the Children', value: '13' },
        { label: 'World Health Organization', value: '14' },
        { label: 'Palestinian Relief Agency', value: '15' },
        { label: 'Humanity First', value: '16' },
        { label: 'Care International', value: '17' },
        { label: 'Volunteer Palestine', value: '18' },
        { label: 'Doctors Without Borders', value: '19' },
      ]
      
    },
    {
      label: 'Start Time',
      key: 'start_time',
      options: Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, '0') + ':00';
        return { label: hour, value: hour };
      }),
    },
    {
      label: 'End Time',
      key: 'end_time',
      options: Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, '0') + ':00';
        return { label: hour, value: hour };
      }),
    },
    {
      label: 'Days',
      key: 'volunteer_days',
      options: weekDaysOptions,
    },
  ];

  return (
    <div className="filter-container">
      <h3 style={{ color: '#2e7d32', textAlign: 'center' }}>Filter Opportunities</h3>
      <div className="filter-fields">
        {fields.map(({ label, key, options }) => (
          <div key={key} className="filter-field">
            <label>{label}</label>
            <select
              value={filters[key]}
              onChange={(e) => handleChange(key, e.target.value)}
            >
              <option value="">Select {label}</option>
              {options && options.map(({ label, value }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <button className="reset-button" onClick={resetFilters}>Reset Filters</button>
    </div>
  );
};

export default FilterComponent;
