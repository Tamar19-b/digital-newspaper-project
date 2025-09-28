import React from 'react';
import logo from '../../../assets/newspaperLogo.png'
import './Header.css';

type ReporterHeaderProps = {
  name: string;
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "בוקר טוב";
  if (hour >= 12 && hour < 18) return "צהריים טובים";
  if (hour >= 18 && hour < 22) return "ערב טוב";
  return "לילה טוב";
};

const ReporterHeader: React.FC<ReporterHeaderProps> = ({ name }) => {
  const greeting = getGreeting();
  return (
    <header className="dashboard-header">
      <img src={logo} alt="logo" className="dashboard-logo" />
      <div style={{ display: 'flex', alignItems: 'center', marginRight: 'auto' }}>
        <div className="profile-pic" />
        <h2 className="dashboard-title" style={{
          fontFamily: 'Heebo, Arial, sans-serif',
          fontWeight: 500,
          fontSize: '26px',
          margin: '0 18px',
          color: '#fff',
          letterSpacing: '1px',
        }}>{greeting} <span style={{fontWeight:700}}>{name}</span></h2>
      </div>
    </header>
  );
};

export default ReporterHeader;
