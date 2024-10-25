import React from 'react';
import './Preloader.css'; // Ensure this file exists

const Preloader: React.FC = () => {
  return (
    <div className="preloader">
      <div className="dot-container">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
};

export default Preloader;