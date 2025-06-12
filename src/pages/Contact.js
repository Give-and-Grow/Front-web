import React, { useState } from 'react';
import './Contact.css'
import AdComponent from '../components/AdComponent'; // Adjust path as needed
import Footer from '../components/Footer'; // مسار الفوتر الجديد حسب مكانه عندك
import Navbar from '../pages/Navbar';  // عدل المسار حسب مكان ملف Navbar.js

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // هنا ممكن تضيفي عملية إرسال البيانات فعليًا (مثلاً API أو Firebase)

    // مثال: رسالة تأكيد بسيطة
    setStatus('Thank you for contacting us! We will get back to you soon.');

    // تنظيف الحقول
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <>
      <Navbar />
      <AdComponent/>
      <div className="contact-page">
      <form onSubmit={handleSubmit} style={{ maxWidth: '700px', margin: '0 auto' }}>
        <p style={{ 
          textAlign: 'center', 
          marginBottom: '20px', 
          color: '#555', 
          fontSize: '1.1rem',
          fontStyle: 'italic',
          lineHeight: '1.4'
        }}>
          We're here to help! Feel free to send us any questions or feedback.
        </p>
        <h2>Contact Us</h2>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
          />
        </label>
        <label>
          Message:
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
          />
        </label>
        <button type="submit" style={{
          backgroundColor: '#4caf50',
          color: 'white',
          padding: '12px 20px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}>Send</button>
        {status && <p style={{ marginTop: '15px', color: '#388e3c', textAlign: 'center' }}>{status}</p>}
      </form>
      </div >
           <Footer />

    </>
  );
};

export default Contact;
