import React, { useState } from 'react';
import './headerN.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';

import famelIcon from '../../../assets/sections/famel.png';
import childrenIcon from '../../../assets/sections/children.png';
import newsIcon from '../../../assets/sections/news.png';
import weatherIcon from '../../../assets/sections/Weather.png';
import economyIcon from '../../../assets/sections/Economy.png';
import logoImage from '../../../assets/newspaperLogo.png';

import Propil from '../propil/propil';

const sections: { key: string; name: string; icon: string }[] = [
  { key: 'נשים', name: 'נשים', icon: famelIcon },
  { key: 'ילדים', name: 'ילדים', icon: childrenIcon },
  { key: 'חדשות', name: 'חדשות', icon: newsIcon },
  { key: 'מזג-אויר', name: 'מזג-אויר', icon: weatherIcon },
  { key: 'כלכלה', name: 'כלכלה', icon: economyIcon },
];

interface HeaderNProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  user: { name: string; avatar: string; token?: string };
  setUser: (user: { name: string; avatar: string; token?: string }) => void;
}

const HeaderN: React.FC<HeaderNProps> = ({ searchTerm, setSearchTerm, user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPropil, setShowPropil] = useState(false);


  const currentSection = decodeURIComponent(location.pathname.split('/newspaper/')[1] || '');

  const userName = user?.name || localStorage.getItem('userName') || 'משתמש';
  const userImage = user?.avatar || localStorage.getItem('userImage') || '';
  const userToken = user?.token || localStorage.getItem('userToken') || '';
  return (
    <>
      <div className="newspaper-header shadow-sm">
        <div className="sections-icons">
          {sections.map((s) => (
            <img
              key={s.key}
              src={s.icon}
              alt={s.name}
              className={`section-icon ${currentSection === s.key ? 'active-section' : ''}`}
              onClick={() => navigate(`/newspaper/${userToken}/${encodeURIComponent(s.key)}`)}
            />
          ))}
        </div>
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 חפש כתבה לפי שם..."
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
            {/* <Route path="/newspaper/:token/:section" element={<SectionPage />} /> */}
        <div
          className="logo-container"
          onClick={() => navigate(`/newspaper/${userToken}`)}
          style={{ cursor: 'pointer' }}
        >
          <img src={logoImage} alt="שם העיתון" className="logo-img" />
        </div>
        {/* דיב פרופיל משתמש */}
        <div className="profile-container" title="הפרופיל שלי" onClick={() => setShowPropil(true)}>
          {userImage && !userImage.startsWith('color:') ? (
            <img src={userImage} alt={userName} className="profile-avatar-img" />
          ) : (
            <div className="profile-avatar-initial" style={{ borderColor: userImage.startsWith('color:') ? userImage.replace('color:', '') : '#ff7000' }}>
              {userName[0] || 'מ'}
            </div>
          )}
        </div>
      </div>
      {showPropil && <Propil user={{ name: userName, avatar: userImage }} setUser={setUser} onClose={() => setShowPropil(false)} />}
    </>
  );
};

export default HeaderN;
