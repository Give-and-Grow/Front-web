import React from "react";
import { CheckCircle, XCircle } from "lucide-react";
import "./InviteFrame.css"; // استدعاء ملف الـ CSS

const InviteFrame = ({ onYes, onNo }) => {
  return (
    <div className="invite-frame">
      <h2>Do you want to invite people?</h2>
      <div className="invite-buttons">
        <button className="invite-button yes" onClick={onYes}>
          <CheckCircle />
          Yes
        </button>
        <button className="invite-button no" onClick={onNo}>
          <XCircle />
          No
        </button>
      </div>
    </div>
  );
};

export default InviteFrame;
