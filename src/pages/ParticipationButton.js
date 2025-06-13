import React, { useEffect, useState } from "react";
import axios from "axios";

const ParticipationButton = ({ opp, participationStatus, handleJoin, handleLeave }) => {
  const [oppStatus, setOppStatus] = useState(null);
  const [userStatus, setUserStatus] = useState(null);

  useEffect(() => {
  const fetchStatuses = async () => {
    try {
      const token = localStorage.getItem("userToken"); // ← احصل على التوكين من localStorage

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,  // أرسل التوكن في الهيدر
        },
      };

      // Get opportunity status from server
      const oppResponse = await axios.get("http://localhost:5000/dropdown/opportunity-statuses", config);
      const currentOppStatus = oppResponse.data.find(o => o.value === opp.status);
      setOppStatus(currentOppStatus?.value);

      // If user has joined, get participant status too
      if (participationStatus[opp.id] === true) {
        const userResponse = await axios.get("http://localhost:5000/dropdown/participant-statuses", config);
        const currentUserStatus = userResponse.data.find(u => u.value === opp.participantStatus);
        setUserStatus(currentUserStatus?.value);
      }
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  };

  fetchStatuses();
}, [opp.id, opp.status, opp.participantStatus, participationStatus]);

  // UI Rendering Logic
  const renderButton = () => {
    if (participationStatus[opp.id] === true) {
      switch (userStatus) {
        case "pending":
          return (
            <button
              style={{ ...styles.joinWithdrawButton, ...styles.leaveButton }}
              onClick={() => handleLeave(opp.id)}
            >
              ✗ Withdraw
            </button>
          );
        case "accepted":
          return <span style={styles.acceptedText}>✓ Accepted</span>;
        case "rejected":
          return <span style={styles.rejectedText}>✗ Rejected</span>;
        default:
          return null;
      }
    } else {
      switch (oppStatus) {
        case "open":
          return (
            <button
              style={{ ...styles.joinWithdrawButton, ...styles.joinButton }}
              onClick={() => handleJoin(opp.id)}
            >
              ✓ Join
            </button>
          );
        case "closed":
          return <span style={styles.closedText}>Closed</span>;
        case "filled":
          return <span style={styles.filledText}>Filled</span>;
        default:
          return null;
      }
    }
  };

  return (
    <div style={styles.joinWithdrawContainer} className="joinWithdrawContainer">
      {renderButton()}
    </div>
  );
};
const styles = {
  joinWithdrawContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 10
  },
  joinWithdrawButton: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: 6,
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  joinButton: {
    backgroundColor: '#28a745',
    color: '#fff',
  },
  leaveButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
  },
  acceptedText: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  rejectedText: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  closedText: {
    color: 'gray',
    fontWeight: 'bold',
  },
  filledText: {
    color: 'orange',
    fontWeight: 'bold',
  },
};

export default ParticipationButton;
