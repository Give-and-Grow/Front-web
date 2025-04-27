import React from 'react';
import './SelectUserType.css';
import ImageRole from '../images/Roleuser.png';  // تأكد من المسار الصحيح للصورة

const SelectUserType = ({ onSelect }) => {
  return (
    <div className="select-container">
      <div className="image-container">
        <img src={ImageRole} alt="Volunteer" className="select-image" />
      </div>
      <h2 className="select-title">Who Are You?</h2>
      <div className="select-buttons">
        <button className="select-button" onClick={() => onSelect("volunteer")}>
          I'm a Volunteer
        </button>
        <button className="select-button" onClick={() => onSelect("organization")}>
          I'm an Organization
        </button>
      </div>
    </div>
  );
};

export default SelectUserType;
