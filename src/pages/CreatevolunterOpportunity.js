import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Navbar from '../pages/Navbar';
import InviteFrame from '../pages/InviteFrame';
import './CreateVolunteerOpportunity.css';

const timeOptions = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
];

const dayOptions = [
  { label: 'Sunday', value: 'sunday' },
  { label: 'Monday', value: 'monday' },
  { label: 'Tuesday', value: 'tuesday' },
  { label: 'Wednesday', value: 'wednesday' },
  { label: 'Thursday', value: 'thursday' },
  { label: 'Friday', value: 'friday' },
  { label: 'Saturday', value: 'saturday' },
];

const CreateVolunteerOpportunity = () => {
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [applicationLink, setApplicationLink] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [basePoints, setBasePoints] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [volunteerDays, setVolunteerDays] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [showInviteFrame, setShowInviteFrame] = useState(false);
  const [createdOpportunityId, setCreatedOpportunityId] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/skills/`)
      .then(res => {
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

  const toggleDay = (dayValue) => {
    if (volunteerDays.includes(dayValue)) {
      setVolunteerDays(volunteerDays.filter(d => d !== dayValue));
    } else {
      setVolunteerDays([...volunteerDays, dayValue]);
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('userToken');

    const formData = {
      title,
      description,
      location,
      start_date: startDate.trim(),
      end_date: endDate.trim(),
      status: 'open',
      image_url: imageUrl,
      application_link: applicationLink,
      contact_email: contactEmail.trim(),
      opportunity_type: 'volunteer',
      skills: selectedSkills.map(s => s.value),
      max_participants: parseInt(maxParticipants),
      base_points: parseInt(basePoints),
      start_time: startTime,
      end_time: endTime,
      volunteer_days: volunteerDays,
    };

    try {
      const response = await axios.post(`http://localhost:5000/opportunities/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const newOpportunityId = response.data.opportunity_id;
      alert('Opportunity created successfully!');

      try {
        const chatResponse = await axios.post(`http://127.0.0.1:5000/chat/opportunity/${newOpportunityId}/create`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        console.log("Chat created:", chatResponse.data);
        alert('Chat created successfully for this opportunity!');

        setCreatedOpportunityId(newOpportunityId);
        setShowInviteFrame(true);

      } catch (chatError) {
        console.error('Failed to create chat', chatError);
        alert('Opportunity created, but failed to create chat.');
      }

    } catch (error) {
      alert('Failed to create opportunity!');
      console.error(error.response?.data || error);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'my_unsigned_preset');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dhrugparh/image/upload',
        formData
      );
      setImageUrl(response.data.secure_url);
      setUploading(false);
    } catch (error) {
      alert('Failed to upload image');
      console.error(error);
      setUploading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="create-volunteer-steps">
      {[1, 2, 3].map(num => (
        <div
          key={num}
          className={`create-volunteer-step-circle ${step === num ? 'create-volunteer-step-circle-active' : ''}`}
        >
          {num}
        </div>
      ))}
    </div>
  );

  return (
    <div className="create-volunteer-container">
      <Navbar />
      <h2 className="create-volunteer-title">Create Opportunity</h2>
      {renderStepIndicator()}

      {step === 1 && (
        <>
          <label className="create-volunteer-label">Title:</label>
          <input
            className="create-volunteer-input"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <label className="create-volunteer-label">Description:</label>
          <textarea
            className="create-volunteer-input create-volunteer-description"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <label className="create-volunteer-label">Location:</label>
          <input
            className="create-volunteer-input"
            placeholder="Location"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
          <button className="create-volunteer-button" onClick={() => setStep(2)}>Next</button>
        </>
      )}

      {step === 2 && (
        <>
          <label className="create-volunteer-label">Start Date:</label>
          <input
            className="create-volunteer-input"
            placeholder="Select start date (Day, Month, Year)"
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
          <label className="create-volunteer-label">End Date:</label>
          <input
            className="create-volunteer-input"
            placeholder="Select end date (Day, Month, Year)"
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
          <label className="create-volunteer-label">Contact Email:</label>
          <input
            className="create-volunteer-input"
            placeholder="Contact Email"
            type="email"
            value={contactEmail}
            onChange={e => setContactEmail(e.target.value)}
          />
          <div className="create-volunteer-buttons-row">
            <button className="create-volunteer-button" onClick={() => setStep(1)}>Back</button>
            <button className="create-volunteer-button" onClick={() => setStep(3)}>Next</button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <label className="create-volunteer-label">Upload Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="create-volunteer-input"
          />
          {uploading && <p>Uploading image...</p>}
          {imageUrl && (
            <>
              <p>Uploaded Image Preview:</p>
              <img src={imageUrl} alt="Uploaded" className="create-volunteer-image-preview" />
            </>
          )}
          <label className="create-volunteer-label">Application Link:</label>
          <input
            className="create-volunteer-input"
            placeholder="Application Link"
            value={applicationLink}
            onChange={e => setApplicationLink(e.target.value)}
          />
          <label className="create-volunteer-label">Max Participants:</label>
          <input
            className="create-volunteer-input"
            placeholder="Max Participants"
            type="number"
            value={maxParticipants}
            onChange={e => setMaxParticipants(e.target.value)}
          />
          <label className="create-volunteer-label">Base Points:</label>
          <input
            className="create-volunteer-input"
            placeholder="Base Points"
            type="number"
            value={basePoints}
            onChange={e => setBasePoints(e.target.value)}
          />
          <label className="create-volunteer-label">Start Time:</label>
          <div className="create-volunteer-horizontal-scroll">
            {timeOptions.map(time => (
              <button
                key={time}
                className={`create-volunteer-skill-button ${startTime === time ? 'create-volunteer-skill-button-active' : 'create-volunteer-skill-button-inactive'}`}
                onClick={() => setStartTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
          <label className="create-volunteer-label">End Time:</label>
          <div className="create-volunteer-horizontal-scroll">
            {timeOptions.map(time => (
              <button
                key={time}
                className={`create-volunteer-skill-button ${endTime === time ? 'create-volunteer-skill-button-active' : 'create-volunteer-skill-button-inactive'}`}
    onClick={() => setEndTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
          <label className="create-volunteer-label">Volunteer Days:</label>
          <div className="create-volunteer-days-container">
            {dayOptions.map(day => (
              <button
                key={day.value}
                className={`create-volunteer-skill-button ${volunteerDays.includes(day.value) ? 'create-volunteer-skill-button-active' : 'create-volunteer-skill-button-inactive'}`}
                onClick={() => toggleDay(day.value)}
              >
                {day.label}
              </button>
            ))}
          </div>
          <label className="create-volunteer-label">Select Skills:</label>
          <Select
            className="create-volunteer-select"
            classNamePrefix="create-volunteer-select"
            options={availableSkills}
            value={selectedSkills}
            onChange={handleSkillsChange}
            isMulti
            placeholder="Select skills..."
            closeMenuOnSelect={false}
          />
          <div className="create-volunteer-buttons-row">
            <button className="create-volunteer-button" onClick={() => setStep(2)}>Back</button>
            <button className="create-volunteer-button" onClick={handleSubmit}>Submit</button>
          </div>
          {showInviteFrame && (
            <InviteFrame
              onYes={() => navigate(`/inviteUsersPage?opportunityId=${createdOpportunityId}`)}
              onNo={() => setShowInviteFrame(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CreateVolunteerOpportunity;