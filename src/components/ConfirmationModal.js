import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Confirm Deletion</h3>
        <p>{message || 'Are you sure you want to delete this message?'}</p>
        <div className="modal-actions">
          <button className="confirm-button" onClick={onConfirm}>
            Delete
          </button>
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;