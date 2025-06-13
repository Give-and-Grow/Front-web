import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminAdRequests.css";
import Sidebar from './Sidebar';
import Navbar from '../pages/Navbar';

const AdminAdRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedAdId, setSelectedAdId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admin/firebase-ads/requests");
      setRequests(response.data);
    } catch (err) {
      console.error("Error fetching ad requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const approveAd = async (id) => {
    try {
      await axios.put(`http://localhost:5000/admin/firebase-ads/requests/${id}/approve`);
      setRequests(requests.filter((ad) => ad.id !== id));
    } catch (err) {
      console.error("Error approving ad:", err);
    }
  };

  const handleReject = (id) => {
    setSelectedAdId(id);
    setShowRejectModal(true);
  };

  const submitRejection = async () => {
    try {
      await axios.put(`http://localhost:5000/admin/firebase-ads/requests/${selectedAdId}/reject`, {
        response_message: rejectReason,
      });
      setRequests(requests.filter((ad) => ad.id !== selectedAdId));
      setShowRejectModal(false);
      setRejectReason("");
    } catch (err) {
      console.error("Error rejecting ad:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
    <Navbar />
      <Sidebar />
   
    <div className="admin-ad-requests">
        
      <h2>Ad Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Store Name</th>
              <th>Description</th>
              <th>Website</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((ad) => (
              <tr key={ad.id}>
                <td>{ad.store_name}</td>
                <td>{ad.description}</td>
                <td>
                  <a href={ad.website_url} target="_blank" rel="noreferrer">
                    Visit
                  </a>
                </td>
                <td>
                  <img src={ad.image_url} alt="ad" className="ad-image" />
                </td>
                <td>
                  <button className="approve" onClick={() => approveAd(ad.id)}>
                    Approve
                  </button>
                  <button className="reject" onClick={() => handleReject(ad.id)}>
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showRejectModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Reject Reason</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
            <div className="modal-buttons">
              <button onClick={submitRejection} className="submit-reject">
                Submit
              </button>
              <button onClick={() => setShowRejectModal(false)} className="cancel">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
     </>
  );
};

export default AdminAdRequests;
