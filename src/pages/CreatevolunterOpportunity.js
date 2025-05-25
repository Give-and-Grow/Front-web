import React, { useState, useEffect } from 'react';
import axios from 'axios';



const CreateVolunteerOpportunity = () => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [applicationLink, setApplicationLink] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [maxParticipants, setMaxParticipants] = useState('');
  const [basePoints, setBasePoints] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [volunteerDays, setVolunteerDays] = useState([]);
  const [filter, setFilter] = useState('add_job');
  const [activeTab, setActiveTab] = useState('creatvoulunter');

  const timeOptions = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const dayOptions = [
    { label: 'Sunday', value: 'sunday' },
    { label: 'Monday', value: 'monday' },
    { label: 'Tuesday', value: 'tuesday' },
    { label: 'Wednesday', value: 'wednesday' },
    { label: 'Thursday', value: 'thursday' },
    { label: 'Friday', value: 'friday' },
    { label: 'Saturday', value: 'saturday' },
  ];

  useEffect(() => {
    axios.get(`http://localhost:5000/skills/`)
      .then(res => setAvailableSkills(res.data))
      .catch(err => alert('Failed to fetch skills'));
  }, []);

  const getToken = () => {
    return localStorage.getItem('userToken');
  };

  const handleSubmit = async () => {
    const token = getToken();
    if (!token) {
      alert('You must be logged in to create an opportunity.');
      return;
    }

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
      skills: selectedSkills,
      max_participants: parseInt(maxParticipants),
      base_points: parseInt(basePoints),
      start_time: startTime,
      end_time: endTime,
      volunteer_days: volunteerDays,
    };

    try {
      await axios.post(`http://localhost:5000/opportunities/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Opportunity created successfully!');
      window.location.href = '/homepage'; // أو استخدم React Router للتنقل
    } catch (err) {
      alert('Failed to create opportunity');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
            <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
            <input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
            <button onClick={() => setStep(2)}>Next</button>
          </>
        );
      case 2:
        return (
          <>
            <input placeholder="Start Date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <input placeholder="End Date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            <input placeholder="Contact Email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
            <button onClick={() => setStep(1)}>Back</button>
            <button onClick={() => setStep(3)}>Next</button>
          </>
        );
      case 3:
        return (
          <>
            <input placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
            <input placeholder="Application Link" value={applicationLink} onChange={e => setApplicationLink(e.target.value)} />
            <input placeholder="Max Participants" type="number" value={maxParticipants} onChange={e => setMaxParticipants(e.target.value)} />
            <input placeholder="Base Points" type="number" value={basePoints} onChange={e => setBasePoints(e.target.value)} />

            <p>Start Time:</p>
            {timeOptions.map(time => (
              <button key={time} onClick={() => setStartTime(time)}>{time}</button>
            ))}

            <p>End Time:</p>
            {timeOptions.map(time => (
              <button key={time} onClick={() => setEndTime(time)}>{time}</button>
            ))}

            <p>Volunteer Days:</p>
            {dayOptions.map(day => (
              <button
                key={day.value}
                onClick={() =>
                  volunteerDays.includes(day.value)
                    ? setVolunteerDays(volunteerDays.filter(d => d !== day.value))
                    : setVolunteerDays([...volunteerDays, day.value])
                }
              >
                {day.label}
              </button>
            ))}

            <p>Select Skills:</p>
            {availableSkills.map(skill => (
              <button
                key={skill.id}
                onClick={() =>
                  selectedSkills.includes(skill.id)
                    ? setSelectedSkills(selectedSkills.filter(id => id !== skill.id))
                    : setSelectedSkills([...selectedSkills, skill.id])
                }
              >
                {skill.name}
              </button>
            ))}

            <button onClick={() => setStep(2)}>Back</button>
            <button onClick={handleSubmit}>Submit</button>
          </>
        );
      default:
        return null;
    }
  };

  return (
   
      <div className="create-opportunity-container">
        <img src="/images/volunteroppertunites.webp" alt="Volunteer Banner" style={{ width: '100%', height: 'auto' }} />
        <h2>Create Opportunity</h2>
        <div className="step-indicator">
          {[1, 2, 3].map(n => (
            <span key={n} style={{ fontWeight: step === n ? 'bold' : 'normal' }}>{`Step ${n}`}</span>
          ))}
        </div>
        {renderStep()}
      </div>
    
  );
};

export default CreateVolunteerOpportunity;
