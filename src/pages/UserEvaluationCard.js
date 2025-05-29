import React, { useEffect, useState } from 'react';
import './UserEvaluationCard.css';

const rankImages = {
  Platinum: "https://res.cloudinary.com/dhrugparh/image/upload/v1748429537/Platinum_ydzy5q.png",
  Gold: "https://res.cloudinary.com/dhrugparh/image/upload/v1748429529/Gold_kaeyoj.png",
  Silver: "https://res.cloudinary.com/dhrugparh/image/upload/v1748429516/Silver_kvsxel.png",
  Bronze: "https://res.cloudinary.com/dhrugparh/image/upload/v1748429525/Bronze_ztc6rv.png",
};

const getRank = (points) => {
  if (points >= 100000) return "Platinum";
  else if (points >= 10000) return "Gold";
  else if (points >= 5000) return "Silver";
  else return "Bronze";
};

const UserEvaluationCard = ({ userId }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('userToken');
      try {
        const response = await fetch(`http://localhost:5000/user-routes/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [userId]);

  if (!profile) {
    return <div className="evaluation-card">Loading...</div>;
  }

  const rank = getRank(profile.total_points);
  const rankImage = rankImages[rank];

  return (
    <div className="evaluation-card">
      <div className="evaluation-info">
      <div className="attendance-rate-container fade-in-up" style={{ animationDelay: '0.1s' }}>
  <div className="attendance-label">
    <strong>Attendance Rate:</strong> {(profile.attendance_rate * 100).toFixed(0)}%
  </div>
  <div className="progress-bar-green">
    <div
      className="progress-fill-green"
      style={{
        width: `${profile.attendance_rate * 100}%`,
      }}
    />
  </div>
</div>

<div className="points-circle-container fade-in-up" style={{ animationDelay: '0.6s' }}>
  <svg viewBox="0 0 36 36" className="circular-chart green">
    <path className="circle-bg"
      d="M18 2.0845
         a 15.9155 15.9155 0 0 1 0 31.831
         a 15.9155 15.9155 0 0 1 0 -31.831"
    />
    <path className="circle"
      strokeDasharray={`${Math.min((profile.total_points / 100000) * 100, 100)}, 100`}
      d="M18 2.0845
         a 15.9155 15.9155 0 0 1 0 31.831
         a 15.9155 15.9155 0 0 1 0 -31.831"
    />
    <text x="18" y="20.35" className="percentage">
      {profile.total_points}
    </text>
  </svg>
  <div className="points-label">Total Points</div>
</div>






      <div className="rank-section fade-in-up" style={{ animationDelay: '0.16s' }}>
 
    <img src={rankImage} alt={`${rank} badge`} className="rank-image" />

</div>

      </div>
    </div>
  );
};

export default UserEvaluationCard;
