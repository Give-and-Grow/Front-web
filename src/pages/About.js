import React, { useState } from 'react';
import Navbar from '../pages/Navbar';

const About = () => {
  // نخزن حالة hover لكل كرتة كمصفوفة من البوليانز
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <>
      <Navbar />
      <div style={styles.wrapper}>
        <div style={styles.container}>
          <h1 style={styles.title}>About Give & Grow</h1>
          <p style={styles.subtitle}>Empowering Volunteers to Make a Difference</p>

          <div style={styles.content}>
            <p style={styles.text}>
              Our project, <strong>Give & Grow</strong>, is designed to motivate and reward volunteers by encouraging active participation in community service.
            </p>
            <p style={styles.text}>
              Volunteers earn points for every task they complete. These points help them unlock exciting job opportunities and rewards.
            </p>
            <p style={styles.text}>
              We believe in celebrating dedication and perseverance. Those with the highest points and consistent effort will receive special incentives and recognition.
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
    background: 'linear-gradient(to bottom, #e8f5e9, #ffffff)',
    minHeight: '100vh',
    paddingTop: '60px',
  },
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '40px 30px',
    fontFamily: "'Poppins', sans-serif",
    color: '#2e7d32',
    backgroundColor: '#f1f8f4',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(46, 125, 50, 0.2)',
    transition: 'all 0.3s ease-in-out',
  },
  title: {
    fontSize: '3rem',
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: '10px',
    color: '#1b5e20',
  },
  subtitle: {
    fontSize: '1.4rem',
    fontWeight: '600',
    textAlign: 'center',
    color: '#43a047',
    marginBottom: '35px',
    fontStyle: 'italic',
  },
  content: {
    fontSize: '1.15rem',
    lineHeight: '1.8',
    marginBottom: '40px',
    padding: '0 15px',
    color: '#2e7d32',
  },
  text: {
    marginBottom: '20px',
  },
  features: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '25px',
    flexWrap: 'wrap',
  },
  featureBox: {
    backgroundColor: '#ffffff',
    flex: '1 1 280px',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 8px 20px rgba(76, 175, 80, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
    textAlign: 'center',
  },
  featureBoxHover: {
    transform: 'translateY(-10px)',
    boxShadow: '0 16px 40px rgba(76, 175, 80, 0.4)',
  },
  featureTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '15px',
    color: '#388e3c',
  },
  featureText: {
    fontSize: '1rem',
    color: '#4e4e4e',
    lineHeight: '1.6',
  },
};

export default About;
