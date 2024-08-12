import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo">ViralFever</div>
      <button className="create-new">Upgrade to Pro</button>
      <nav>
       
      </nav>
      <div className="storage">
        <div className="storage-bar">
          <div className="storage-used" style={{width: '90%'}}></div>
        </div>
        <p>1 out of 1 uploads left</p>
        <button className="upgrade-btn">Upgrade to Pro</button>
      </div>
    </aside>
  );
};

export default Sidebar;