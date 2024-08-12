import React from 'react';
import './Dashboard.css';

const Dashboard = ({ usedStorage, totalStorage }) => {
  const percentageUsed = (usedStorage / totalStorage) * 100;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="storage-info">
        <p>1 of 1 uploads left</p>
        <div className="storage-bar">
          <div className="storage-used" style={{width: `${percentageUsed}%`}}>
            <span className="compressed"></span>
            <span className="spreadsheet"></span>
            <span className="others"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;