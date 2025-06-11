import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Toast disappears after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`toast toast-${type}`} role="alert" aria-live="assertive">
      <p>{message}</p>
      <button className="toast-close" onClick={onClose} aria-label="Close notification">
        ×
      </button>
    </div>
  );
};

export default Toast;