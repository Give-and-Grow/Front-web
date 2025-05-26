import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateVolunteerOpportunity = () => {
  const [step, setStep] = useState(1);

  // Step 1 fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  // Step 2 fields
  const [contactEmail, setContactEmail] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Step 3 fields
  const [requiredVolunteers, setRequiredVolunteers] = useState('');
  const [points, setPoints] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [volunteerDays, setVolunteerDays] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);

  // Options for times and days
  const timeOptions = [
    '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM',
    '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM',
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
    '6:00 PM', '7:00 PM', '8:00 PM',
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

  useEffect(() => {
    // Fetch available skills from server on component mount
    axios.get('http://localhost::5000/skills/')
      .then(res => setAvailableSkills(res.data))
      .catch(err => console.error('Failed to load skills:', err));
  }, []);
function convertTo24HourFormat(time12h) {
  // time12h مثل "9:00 AM" أو "12:30 PM"
  const [time, modifier] = time12h.split(' '); // تفصل الوقت عن AM/PM
  let [hours, minutes] = time.split(':');

  if (hours === '12') {
    hours = '00'; // في 12 AM يكون الساعة 00
  }

  if (modifier.toUpperCase() === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }

  // نرجع الوقت بصيغة "HH:MM" مع التأكد من رقمين للساعات
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

  const handleSubmit = () => {
    // Basic validation (add more if needed)
    if (!title || !description || !location) {
      alert('Please fill all fields in Step 1');
      setStep(1);
      return;
    }
    if (!contactEmail || !startDate || !endDate) {
      alert('Please fill all fields in Step 2');
      setStep(2);
      return;
    }
    if (!requiredVolunteers || !points || !startTime || !endTime || volunteerDays.length === 0) {
      alert('Please complete all fields in Step 3');
      setStep(3);
      return;
    }

    const data = {
  title,
  description,
  location,
  contact_email: contactEmail,
  start_date: startDate,
  end_date: endDate,
  status: 'open', // ممكن تتحكم فيها إذا كانت ثابتة
  image_url: '', // لو عندك رابط صورة حطها هنا
  application_link: '', // لو عندك رابط تقديم حطها هنا
  opportunity_type: 'volunteer', // ثابت أو حسب اختيار المستخدم
  skills: selectedSkills, // تأكد أنهم IDs أرقام مش أسماء
  max_participants: Number(requiredVolunteers),
  base_points: Number(points),
  start_time: convertTo24HourFormat(startTime),
  end_time: convertTo24HourFormat(endTime),
  volunteer_days: volunteerDays,
};


    axios.post('http://localhost:5000/opportunities/create', data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
    .then(() => {
      alert('Volunteer opportunity created successfully!');
      // Reset form or redirect as needed
    })
    .catch(err => {
      alert('Failed to create opportunity: ' + err.message);
    });
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      {step === 1 && (
        <>
          <h2>Create Volunteer Opportunity - Step 1</h2>
          <label style={labelStyle}>Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={inputStyle}
            placeholder="Enter opportunity title"
          />

          <label style={labelStyle}>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ ...inputStyle, height: 100 }}
            placeholder="Describe the opportunity"
          />

          <label style={labelStyle}>Location</label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            style={inputStyle}
            placeholder="Enter location"
          />

          <button onClick={() => setStep(2)} style={buttonStyle}>Next</button>
        </>
      )}

      {step === 2 && (
        <>
          <h2>Create Volunteer Opportunity - Step 2</h2>

          <label style={labelStyle}>Contact Email</label>
          <input
            type="email"
            value={contactEmail}
            onChange={e => setContactEmail(e.target.value)}
            style={inputStyle}
            placeholder="Enter contact email"
          />

          <label style={labelStyle}>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            style={inputStyle}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
            <button onClick={() => setStep(1)} style={buttonStyle}>Back</button>
            <button onClick={() => setStep(3)} style={buttonStyle}>Next</button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h2>Create Volunteer Opportunity - Step 3</h2>

          <label style={labelStyle}>Number of Volunteers Needed</label>
          <input
            type="number"
            min={1}
            value={requiredVolunteers}
            onChange={e => setRequiredVolunteers(e.target.value)}
            style={inputStyle}
            placeholder="Enter number of volunteers"
          />

          <label style={labelStyle}>Points</label>
          <input
            type="number"
            min={0}
            value={points}
            onChange={e => setPoints(e.target.value)}
            style={inputStyle}
            placeholder="Enter points for volunteers"
          />

          <label style={labelStyle}>Start Time</label>
          <div style={{ display: 'flex', overflowX: 'auto', gap: 8, marginBottom: 10 }}>
            {timeOptions.map(time => (
              <div
                key={time}
                onClick={() => setStartTime(time)}
                style={{
                  padding: '5px 10px',
                  borderRadius: 5,
                  cursor: 'pointer',
                  backgroundColor: startTime === time ? '#66bb6a' : '#eee',
                  color: startTime === time ? 'white' : 'black',
                  whiteSpace: 'nowrap',
                }}
              >
                {time}
              </div>
            ))}
          </div>

          <label style={labelStyle}>End Time</label>
          <div style={{ display: 'flex', overflowX: 'auto', gap: 8, marginBottom: 10 }}>
            {timeOptions.map(time => (
              <div
                key={time}
                onClick={() => setEndTime(time)}
                style={{
                  padding: '5px 10px',
                  borderRadius: 5,
                  cursor: 'pointer',
                  backgroundColor: endTime === time ? '#66bb6a' : '#eee',
                  color: endTime === time ? 'white' : 'black',
                  whiteSpace: 'nowrap',
                }}
              >
                {time}
              </div>
            ))}
          </div>

          <label style={labelStyle}>Volunteer Days</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
            {dayOptions.map(day => (
              <div key={day.value} style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  id={day.value}
                  checked={volunteerDays.includes(day.value)}
                  onChange={() => {
                    if (volunteerDays.includes(day.value)) {
                      setVolunteerDays(volunteerDays.filter(d => d !== day.value));
                    } else {
                      setVolunteerDays([...volunteerDays, day.value]);
                    }
                  }}
                />
                <label htmlFor={day.value} style={{ marginLeft: 5 }}>{day.label}</label>
              </div>
            ))}
          </div>

          <label style={labelStyle}>Required Skills</label>
          <select
            multiple
            value={selectedSkills}
            onChange={e => {
              const options = Array.from(e.target.selectedOptions).map(o => o.value);
              setSelectedSkills(options);
            }}
            style={{ ...inputStyle, height: 100 }}
          >
            {availableSkills.map(skill => (
              <option key={skill._id} value={skill._id}>
                {skill.name}
              </option>
            ))}
          </select>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
            <button onClick={() => setStep(2)} style={buttonStyle}>Back</button>
            <button onClick={handleSubmit} style={{ ...buttonStyle, backgroundColor: '#388e3c' }}>
              Create Opportunity
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: 10,
  marginBottom: 15,
  borderRadius: 5,
  border: '1px solid #ccc',
  fontSize: 16,
  boxSizing: 'border-box',
};

const labelStyle = {
  marginBottom: 5,
  fontWeight: 'bold',
  color: '#2e7d32',
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#66bb6a',
  color: 'white',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontWeight: 'bold',
};

export default CreateVolunteerOpportunity;
