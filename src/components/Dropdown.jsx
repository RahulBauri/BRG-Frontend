import React, { useEffect, useState } from 'react';
import './Dropdown.css'; // Import the CSS file for styling

const Dropdown = ({ title, children, propOpen }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(propOpen)
  },[propOpen])

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`dropdown-wrapper ${isOpen ? 'open' : ''}`}>
      <button className="dropdown-button" onClick={toggleDropdown}>
        {title}
      </button>
      <div className="dropdown-content">
        {children}
      </div>
    </div>
  );
};

export default Dropdown;
