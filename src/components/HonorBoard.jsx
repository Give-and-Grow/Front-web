// src/pages/HonorBoard.js
import React, { useEffect, useState } from 'react';
import Navbar from '../pages/Navbar'; // Adjust path as needed
import AdComponent from '../components/AdComponent'; // Import the updated AdComponent
import confetti from 'canvas-confetti';
import './HonorBoard.css';

const HonorBoard = () => {
  const [period, setPeriod] = useState("all");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [isYearSelected, setIsYearSelected] = useState(false);
  const [isMonthSelected, setIsMonthSelected] = useState(false);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (period !== "all") params.append("period", period);
      if (["month", "smonth", "year"].includes(period) && isYearSelected) {
        params.append("year", year);
      }
      if (period === "month" && isMonthSelected) {
        params.append("month", month);
      }

      const response = await fetch(`http://localhost:5000/volunteers/top/all-honors?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Received data:", data);
      setVolunteers(data);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsYearSelected(false);
    setIsMonthSelected(false);
    setYear(new Date().getFullYear());
    setMonth(new Date().getMonth() + 1);
  }, [period]);

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2e7d32', '#4caf50', '#ffffff'],
    });

    fetchVolunteers();
  }, [period, isYearSelected, year, isMonthSelected, month]);

  return (
    <>
      <Navbar />
      <div className="honor-board-wrapper">
        <div className="honor-board-container">
          <h2>Honor Board</h2>
          <div className="filter-section">
            <label>Period Type: </label>
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="all">All</option>
              <option value="month">Monthly</option>
              <option value="smonth">Semi-Annually</option>
              <option value="year">Annually</option>
            </select>

            {["month", "smonth", "year"].includes(period) && (
              <>
                <label>Year: </label>
                <select
                  value={year}
                  onChange={(e) => {
                    setYear(Number(e.target.value));
                    setIsYearSelected(true);
                  }}
                >
                  <option value="" disabled>Select Year</option>
                  {[2022, 2023, 2024, 2025].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </>
            )}

            {period === "month" && (
              <>
                <label>Month: </label>
                <select
                  value={month}
                  onChange={(e) => {
                    setMonth(Number(e.target.value));
                    setIsMonthSelected(true);
                  }}
                >
                  <option value="" disabled>Select Month</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </>
            )}
          </div>

          {loading ? (
            <p className="loading">Loading...</p>
          ) : (
            <div className="volunteer-list">
              {volunteers.length === 0 ? (
                <p className="no-volunteers">No volunteers found for this period.</p>
              ) : (
                volunteers.map((v, idx) => (
                  <div
                    key={idx}
                    className="volunteer-card"
                    onClick={() =>
                      confetti({
                        particleCount: 50,
                        spread: 50,
                        origin: { y: 0.6 },
                        colors: ['#2e7d32', '#4caf50', '#ffffff'],
                      })
                    }
                  >
                    <img src={v.image || '/default-avatar.png'} alt={v.full_name} />
                    <div>
                      <h4>{v.full_name}</h4>
                      <p>Points: {v.total_points}</p>
                      <p>
                        From {v.period_start} to {v.period_end}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <div className="ad-sidebar right-sidebar">
          <AdComponent />
        </div>
      </div>
    </>
  );
};

export default HonorBoard;