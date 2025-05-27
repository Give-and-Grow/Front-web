import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select'; 
import DatePicker, { registerLocale } from 'react-datepicker';
import enUS from 'date-fns/locale/en-US';  // استيراد اللغة الإنجليزية
import Navbar from '../pages/Navbar';  // عدل المسار حسب مكان ملف Navbar.js
// تسجل اللغة الانجليزية مع المكتبة
registerLocale('en-US', enUS);
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


  const toggleDay = (dayValue) => {
    if (volunteerDays.includes(dayValue)) {
      setVolunteerDays(volunteerDays.filter(d => d !== dayValue));
    } else {
      setVolunteerDays([...volunteerDays, dayValue]);
    }
  };

  const toggleSkill = (skillId) => {
    if (selectedSkills.includes(skillId)) {
      setSelectedSkills(selectedSkills.filter(id => id !== skillId));
    } else {
      setSelectedSkills([...selectedSkills, skillId]);
    }
  };

 const handleSubmit = async () => {
  const token = localStorage.getItem('userToken');  // استدعاء التوكين

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
    await axios.post(`http://localhost:5000/opportunities/create`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,  // إضافة التوكين في الهيدر
      }
    });
    alert('Opportunity created successfully!');
    // يمكن إعادة التوجيه أو تفريغ الحقول هنا
     navigate('/homepage'); 
  } catch (error) {
    alert('Failed to create opportunity!');
    console.error(error.response?.data || error);
  }
};


  const renderStepIndicator = () => (
    <div style={styles.stepIndicator}>
      {[1, 2, 3].map(num => (
        <div
          key={num}
          style={{
            ...styles.stepCircle,
            backgroundColor: step === num ? '#66bb6a' : '#ccc',
          }}
        >
          {num}
        </div>
      ))}
    </div>
  );

  return (
     
    <div style={styles.container}>
     
      <Navbar />
      <h2 style={styles.heading}>Create Opportunity</h2>
      {renderStepIndicator()}

      {step === 1 && (
        <>
        <label style={styles.label}>Title:</label>
          <input
            style={styles.input}
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <label style={styles.label}>Description:</label>
          <textarea
  style={{ ...styles.input, height: 100, resize: 'none' }}
  placeholder="Description"
  value={description}
  onChange={e => setDescription(e.target.value)}
/>
<label style={styles.label}>Location:</label>
          <input
            style={styles.input}
            placeholder="Location"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
          <button style={styles.button} onClick={() => setStep(2)}>Next</button>
        </>
      )}

      {step === 2 && (
        <>
        <label style={styles.label}>Start Date:</label>
<input
  style={styles.input}
  placeholder="Select start date (Day, Month, Year)"
  type="date"
  value={startDate}
  onChange={e => setStartDate(e.target.value)}
/>

<label style={styles.label}>End Date:</label>
<input
  style={styles.input}
  placeholder="Select end date (Day, Month, Year)"
  type="date"
  value={endDate}
  onChange={e => setEndDate(e.target.value)}
/>

<label style={styles.label}>Contact Email:</label>
          <input
            style={styles.input}
            placeholder="Contact Email"
            type="email"
            value={contactEmail}
            onChange={e => setContactEmail(e.target.value)}
          />
          <div style={styles.buttonsContainer}>
            <button style={styles.button} onClick={() => setStep(1)}>Back</button>
            <button style={styles.button} onClick={() => setStep(3)}>Next</button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
        
<label style={styles.label}>Image:</label>
          <input
            style={styles.input}
            placeholder="Image URL"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
          />
          <label style={styles.label}>Application Link:</label>
          <input
            style={styles.input}
            placeholder="Application Link"
            value={applicationLink}
            onChange={e => setApplicationLink(e.target.value)}
          />
           <label style={styles.label}>Max Participants:</label>
          <input
            style={styles.input}
            placeholder="Max Participants"
            type="number"
            value={maxParticipants}
            onChange={e => setMaxParticipants(e.target.value)}
          />
           <label style={styles.label}>Base Points:</label>
          <input
            style={styles.input}
            placeholder="Base Points"
            type="number"
            value={basePoints}
            onChange={e => setBasePoints(e.target.value)}
          />

          <label style={styles.label}>Start Time:</label>
          <div style={styles.horizontalScroll}>
            {timeOptions.map(time => (
              <button
                key={time}
                style={{
                  ...styles.skillButton,
                  backgroundColor: startTime === time ? '#66bb6a' : '#a5d6a7',
                }}
                onClick={() => setStartTime(time)}
              >
                {time}
              </button>
            ))}
          </div>

          <label style={styles.label}>End Time:</label>
          <div style={styles.horizontalScroll}>
            {timeOptions.map(time => (
              <button
                key={time}
                style={{
                  ...styles.skillButton,
                  backgroundColor: endTime === time ? '#66bb6a' : '#a5d6a7',
                }}
                onClick={() => setEndTime(time)}
              >
                {time}
              </button>
            ))}
          </div>

          <label style={styles.label}>Volunteer Days:</label>
          <div style={styles.daysContainer}>
            {dayOptions.map(day => (
              <button
                key={day.value}
                style={{
                  ...styles.skillButton,
                  backgroundColor: volunteerDays.includes(day.value) ? '#66bb6a' : '#a5d6a7',
                  marginRight: 10,
                  marginBottom: 10,
                }}
                onClick={() => toggleDay(day.value)}
              >
                {day.label}
              </button>
            ))}
          </div>

         <label style={styles.label}>Select Skills:</label>
          <Select
            options={availableSkills}
            value={selectedSkills}
            onChange={handleSkillsChange}
            isMulti
            placeholder="Select skills..."
            closeMenuOnSelect={false}
          />

          <div style={styles.buttonsContainer}>
            <button style={styles.button} onClick={() => setStep(2)}>Back</button>
            <button style={styles.button} onClick={handleSubmit}>Submit</button>
          </div>
        </>
        
      )}
       
    </div>
   
     
  );
 
};
const styles = {
  container: {
    maxWidth: 600,
    margin: '40px auto',
    padding: 30,
    backgroundColor: 'color: #2e7d32;',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    borderRadius: 12,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#34495e',
  },
  banner: {
    width: '100%',
    borderRadius: 10,
    marginBottom: 25,
    objectFit: 'cover',
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 25,
    color: '#2c3e50',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    marginBottom: 20,
    borderRadius: 8,
    border: '1.5px solid #d1d8e0',
    fontSize: 16,
    transition: 'border-color 0.3s',
    outline: 'none',
    boxSizing: 'border-box',
  },
  inputFocus: {
    borderColor: '#2980b9',
    boxShadow: '0 0 5px color: #2e7d32;',
  },
  button: {
    backgroundColor: 'color: #2e7d32;',
    color: 'white',
    border: 'none',
    padding: '12px 25px',
    borderRadius: 8,
    fontSize: 16,
    cursor: 'pointer',
    fontWeight: '600',
    boxShadow: '0 4px 8px rgba(39, 174, 96, 0.4)',
    transition: 'background-color 0.3s ease',
    marginRight: 15,
    minWidth: 100,
  },
  buttonHover: {
    backgroundColor: 'color: #2e7d32;',
  },
  buttonsContainer: {
    marginTop: 20,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  stepIndicator: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 30,
    gap: 15,
  },
  stepCircle: {
    width: 35,
    height: 35,
    borderRadius: '50%',
    lineHeight: '35px',
    textAlign: 'center',
    fontWeight: '700',
    color: 'white',
    fontSize: 16,
    userSelect: 'none',
  },
  label: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 10,
    color: '#34495e',
    display: 'block',
  },
  horizontalScroll: {
    display: 'flex',
    overflowX: 'auto',
    paddingBottom: 10,
    marginBottom: 20,
    gap: 12,
  },
  skillButton: {
    flexShrink: 0,
    padding: '8px 16px',
    borderRadius: 20,
    border: 'none',
    fontWeight: '600',
    fontSize: 14,
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    color: '#2c3e50',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  daysContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: 20,
  },



};




export default CreateVolunteerOpportunity;
