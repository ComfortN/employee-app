import React from 'react';
import './Popup.css';

export default function Popup({ message, onClose }) {
  return (
    <div className="popup">
        <div className="popup-content">
            <p>{message}</p>
        </div>
    </div>
  )
}
