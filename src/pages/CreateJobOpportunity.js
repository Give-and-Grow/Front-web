import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreateJobOpportunity.css';
import Select from 'react-select'; 
import { useNavigate } from 'react-router-dom';
import Navbar from '../pages/Navbar';  // عدل المسار حسب مكان ملف Navbar.js
const CreateJobOpportunity = () => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [requiredPoints, setRequiredPoints] = useState('');
 const [selectedSkills, setSelectedSkills] = useState([]);
   const [availableSkills, setAvailableSkills] = useState([]);
 const navigate = useNavigate();
   useEffect(() => {
    axios.get(`http://localhost:5000/skills/`)
      .then(res => {
        // تحويل السكيلز لصيغة react-select
        const skillsOptions = res.data.map(skill => ({
          value: skill.id,
          label: skill.name,
        }));
        setAvailableSkills(skillsOptions);
      })
      .catch(err => alert('Failed to fetch skills'));
  }, []);
const handleSkillsChange = (selectedOptions) => {
    setSelectedSkills(selectedOptions || []);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      alert('You must be logged in');
      return;
    }

    const formData = {
      title,
      description,
      location,
      start_date: startDate,
      end_date: endDate,
      contact_email: contactEmail,
      required_points: parseInt(requiredPoints),
      opportunity_type: 'job',
    skills: selectedSkills.map(s => s.value),
    };

    try {
      await axios.post(`http://localhost:5000/opportunities/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Job opportunity created!');
       navigate('/homepage'); 
    } catch (error) {
      alert('Failed to create job opportunity');
      console.error(error.response?.data || error);
    }
  };

  return (
     <>
      <Navbar />
    <div className="container">
      <h2>Create Job Opportunity</h2>

      <div className="steps">
        {[1, 2].map((num) => (
          <div key={num} className={`step-circle ${step === num ? 'active' : ''}`}>
            {num}
          </div>
        ))}
      </div>

      {step === 1 && (
        <>
          <input
            className="input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="input description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            className="input"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button className="button" onClick={() => setStep(2)}>Next</button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            className="input"
            type="date"
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            className="input"
            type="date"
            placeholder="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <input
            className="input"
            placeholder="Contact Email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
          <input
            className="input"
            placeholder="Required Points"
            type="number"
            value={requiredPoints}
            onChange={(e) => setRequiredPoints(e.target.value)}
          />

       <label className="label">Select Skills</label>

          <Select
  className="custom-select"
  classNamePrefix="select"
  options={availableSkills}
  value={selectedSkills}
  onChange={handleSkillsChange}
  isMulti
  placeholder="Select skills..."
  closeMenuOnSelect={false}
/>


          <div className="buttons-row">
            <button className="button" onClick={() => setStep(1)}>Back</button>
            <button className="button" onClick={handleSubmit}>Submit</button>
          </div>
        </>
      )}
    </div>
     </>
  );
};

export default CreateJobOpportunity;
