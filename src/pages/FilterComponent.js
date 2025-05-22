import React, { useState } from 'react';
import './FilterComponent.css'; // You can create this CSS file separately

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
      options: [
        { label: 'Open', value: 'Open' },
        { label: 'Closed', value: 'Closed' },
      ],
    },
    {
      label: 'Opportunity Type',
      key: 'opportunity_type',
      options: [
        { label: 'Job', value: 'Job' },
        { label: 'Volunteer', value: 'Volunteer' },
      ],
    },
    {
      label: 'Location',
      key: 'location',
      options: [
        { label: 'Ramallah', value: 'Ramallah' },
        { label: 'Jerusalem', value: 'Jerusalem' },
        { label: 'Gaza', value: 'Gaza' },
      ],
    },
    {
      label: 'Skill',
      key: 'skill_id',
      options: [
        { label: 'Programming', value: '1' },
        { label: 'Design', value: '2' },
        { label: 'Marketing', value: '3' },
      ],
    },
    {
      label: 'Organization',
      key: 'organization_id',
      options: [
        { label: 'Red Crescent', value: '10' },
        { label: 'UNICEF', value: '11' },
        { label: 'Green NGO', value: '12' },
      ],
    },
    {
      label: 'Start Time',
      key: 'start_time',
      options: [
        '06:00', '08:00', '10:00', '12:00',
        '14:00', '16:00', '18:00', '20:00', '22:00'
      ].map(time => ({ label: time, value: time })),
    },
    {
      label: 'End Time',
      key: 'end_time',
      options: [
        { label: '06:00', value: '06:00' },
        { label: '08:00', value: '08:00' },
      ],
    },
    {
      label: 'Days',
      key: 'volunteer_days',
      options: [
        { label: 'Monday', value: 'Monday' },
        { label: 'Tuesday', value: 'Tuesday' },
      ],
    },
  ];

  return (
    <div className="filter-container">
      {fields.map(({ label, key, options }) => (
        <div className="dropdown-container" key={key}>
          <label className="dropdown-label">{label}</label>
          <select
            className="dropdown"
            value={filters[key]}
            onChange={(e) => handleChange(key, e.target.value)}
          >
            <option value="">Select {label}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}
      <button className="reset-button" onClick={resetFilters}>
        Reset Filters
      </button>
    </div>
  );
};

export default FilterComponent;
