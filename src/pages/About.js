import React, { useState } from 'react';
import Navbar from '../pages/Navbar';
import Footer from '../components/Footer'; // مسار الفوتر الجديد حسب مكانه عندك
import AdComponent from '../components/AdComponent'; // Adjust path as needed

const About = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <>
      <Navbar />
      <AdComponent/>
      <div style={styles.wrapper}>
        <div style={styles.container}>
          <h1 style={styles.title}>About <span style={styles.brand}>Give & Grow</span></h1>
          <p style={styles.subtitle}>Empowering Volunteers to Make a Difference</p>

          <div style={styles.content}>
            <p style={styles.text}>
              <strong>Give & Grow</strong> is a platform that empowers volunteers through motivation, rewards, and impactful community involvement.
            </p>
            <p style={styles.text}>
              Volunteers collect points with each completed task. These points unlock job opportunities, exclusive rewards, and personal growth.
            </p>
            <p style={styles.text}>
              We celebrate commitment and consistency. Top contributors receive recognition and inspiring incentives.
            </p>
          </div>

          <div style={styles.features}>
            {featureData.map((feature, i) => {
              const isHovered = hoveredIndex === i;
              return (
                <div
                  key={i}
                  style={{
                    ...styles.featureBox,
                    ...(isHovered ? styles.featureBoxHover : {}),
                  }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <h3 style={styles.featureTitle}>{feature.title}</h3>
                  <p style={styles.featureText}>{feature.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />

    </>
  );
};

const featureData = [
  {
    title: 'Earn Points',
    text: 'Collect points by participating in volunteering activities and community projects.',
  },
  {
    title: 'Get Rewarded',
    text: 'Redeem your points for job opportunities and exclusive rewards tailored for active volunteers.',
  },
  {
    title: 'Grow Together',
    text: 'Build your skills, network, and make a real impact in your community with Give & Grow.',
  },
];

const styles = {
  wrapper: {
    background: 'linear-gradient(to bottom right, #d0f0dc, #ffffff)',
    minHeight: '100vh',
    paddingTop: '70px',
   fontFamily: "Times New Roman, Times, serif"

  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '50px 40px',
    backgroundColor: '#ffffff',
    borderRadius: '25px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '3.2rem',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: '10px',
    color: '#2e7d32',
  },
  brand: {
    color: '#1b5e20',
  },
  subtitle: {
    fontSize: '1.5rem',
    fontWeight: '500',
    textAlign: 'center',
    color: '#388e3c',
    marginBottom: '40px',
    fontStyle: 'italic',
  },
  content: {
    fontSize: '1.2rem',
    lineHeight: '1.9',
    marginBottom: '50px',
    padding: '0 20px',
    color: '#2f4f4f',
  },
  text: {
    marginBottom: '22px',
  },
  features: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '30px',
  },
  featureBox: {
    backgroundColor: '#f7fcf8',
    flex: '1 1 300px',
    padding: '30px 25px',
    borderRadius: '18px',
    boxShadow: '0 6px 20px rgba(76, 175, 80, 0.15)',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    border: '2px solid transparent',
  },
  featureBoxHover: {
    transform: 'translateY(-8px)',
    borderColor: '#66bb6a',
    boxShadow: '0 14px 35px rgba(76, 175, 80, 0.35)',
  },
  featureTitle: {
    fontSize: '1.6rem',
    fontWeight: '700',
    marginBottom: '15px',
    color: '#2e7d32',
  },
  featureText: {
    fontSize: '1.05rem',
    color: '#4b4b4b',
    lineHeight: '1.7',
  },
};

export default About;
