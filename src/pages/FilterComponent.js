import React, { useState, useEffect } from 'react';
import Select from 'react-select';
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
  const [organizationOptions, setOrganizationOptions] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/dropdown/opportunity-statuses')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(item => ({
          label: item.label,
          value: item.value,
        }));
        setStatusOptions(formatted);
      })
      .catch(err => console.error('Failed to fetch status options:', err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/dropdown/opportunity-types')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(item => ({
          label: item.label,
          value: item.value,
        }));
        setOpportunityTypeOptions(formatted);
      })
      .catch(err => console.error('Failed to fetch opportunity types:', err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/dropdown/week-days')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(item => ({
          label: item.label,
          value: item.value,
        }));
        setWeekDaysOptions(formatted);
      })
      .catch(err => console.error('Failed to fetch week days:', err));
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/dropdown/skills')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(skill => ({
          label: skill.label,
          value: skill.value.toString()
        }));
        setSkillOptions(formatted);
      })
      .catch(err => console.error('Failed to fetch skills:', err));
  }, []);

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
      { label: 'Al-Eizariya', value: 'Al-Eizariya' },
    ];
    setLocationOptions(palestineCities.sort((a, b) => a.label.localeCompare(b.label)));
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/public/organizations/')
      .then(res => res.json())
      .then(data => {
        const formatted = data.results.map(org => ({
          label: org.name,
          value: org.id.toString()
        }));
        setOrganizationOptions(formatted);
      })
      .catch(err => console.error('Failed to fetch organizations:', err));
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
    { label: 'Status', key: 'status', options: statusOptions },
    { label: 'Opportunity Type', key: 'opportunity_type', options: opportunityTypeOptions },
    { label: 'Location', key: 'location', options: locationOptions },
    { label: 'Skill', key: 'skill_id', options: skillOptions },
    { label: 'Organization', key: 'organization_id', options: organizationOptions },
    {
      label: 'Start Time', key: 'start_time',
      options: Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, '0') + ':00';
        return { label: hour, value: hour };
      })
    },
    {
      label: 'End Time', key: 'end_time',
      options: Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, '0') + ':00';
        return { label: hour, value: hour };
      })
    },
    { label: 'Days', key: 'volunteer_days', options: weekDaysOptions },
  ];

  return (
    <div className="filter-container">
      <h3 style={{ color: '#2e7d32', textAlign: 'center' }}>Filter Opportunities</h3>
      <div className="filter-fields">
        {fields.map(({ label, key, options }) => (
          <div key={key} className="filter-field">
            <label>{label}</label>
            <Select
              options={options}
              value={options.find(opt => opt.value === filters[key]) || null}
              onChange={(selected) => handleChange(key, selected ? selected.value : '')}
              placeholder={`Select ${label}`}
              isClearable
              isSearchable
            />
          </div>
        ))}
      </div>
      <button className="reset-button" onClick={resetFilters}>Reset Filters</button>
    </div>
  );
};

export default FilterComponent;
