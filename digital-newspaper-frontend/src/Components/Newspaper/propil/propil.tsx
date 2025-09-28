
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../../store/slices/userSlice';
import { RootState } from '../../../store';
import { removeFavorite } from '../../../store/slices/favoritesSlice';
import './propil.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface PropilProps {
  user: { name: string; avatar: string; token?: string };
  setUser: (user: { name: string; avatar: string; token?: string }) => void;
  onClose: () => void;
}

const Propil: React.FC<PropilProps> = ({ user, setUser, onClose }) => {
  const navigate = useNavigate();
  // התנתקות
  const handleLogout = () => {
    dispatch(logout());
    setUser({ name: '', avatar: '', token: '' });
    onClose();
    navigate('/log-in');
  };
  // שליפת ערכי ברירת מחדל מה-localStorage אם לא הועברו
  // תמיד טען מה-localStorage כדי שהערך יהיה עדכני
  const [name, setName] = useState(localStorage.getItem('userName') || user.name || '');
  const [avatar, setAvatar] = useState(localStorage.getItem('userImage') || user.avatar || '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const favorites = useSelector((state: RootState) => state.favorites.items);
  const dispatch = useDispatch();

  // העלאת תמונה מהמחשב
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target && typeof ev.target.result === 'string') {
          setAvatar(ev.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // שלוף את המשתמש המלא מהשרת (כולל סיסמה)
    const currentUserStr = localStorage.getItem('currentUser');
    if (!currentUserStr) {
      alert('משתמש לא מחובר');
      return;
    }
    const currentUser = JSON.parse(currentUserStr);
    try {
      const res = await fetch(`http://localhost:8080/users/${currentUser.id}`);
      if (!res.ok) throw new Error('שגיאה בשליפת פרטי משתמש');
      const userFromServer = await res.json();
      // בצע עדכון לשרת
      const updatedUser = {
        ...userFromServer,
        name,
        image: avatar,
      };
      const updateRes = await fetch('http://localhost:8080/users/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });
      if (!updateRes.ok) throw new Error('שגיאה בעדכון פרטי משתמש');
      // עדכן סטייט ו-localStorage (ללא סיסמה)
      setUser({ name, avatar });
      localStorage.setItem('userName', name);
      localStorage.setItem('userImage', avatar);
      const newCurrentUser = { ...currentUser, name, image: avatar };
      delete newCurrentUser.password;
      localStorage.setItem('currentUser', JSON.stringify(newCurrentUser));
      onClose();
    } catch (err) {
      alert('שגיאה בעדכון פרופיל');
    }
  };

  return (
    <div className="propil-sidebar">
      <button className="propil-close" onClick={onClose} title="סגור">×</button>
      <div className="propil-content">
        <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <i className="bi bi-person-circle" style={{ color: '#ff7000', fontSize: '2.1rem' }}></i>
          עריכת פרופיל
        </h2>
        <form onSubmit={handleSave} className="propil-form">
          <div className="propil-avatar-edit">
            {avatar && !avatar.startsWith('color:') ? (
              <img src={avatar} alt="avatar" className="propil-avatar-img" />
            ) : (
              <div className="propil-avatar" style={{ borderColor: avatar.startsWith('color:') ? avatar.replace('color:', '') : '#ff7000' }}>
                <i className="bi bi-person-fill" style={{ fontSize: '2.2rem', color: '#ff7000' }}></i>
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, width: '100%', justifyContent: 'center' }}>
              <button type="button" className="propil-upload-btn" onClick={handleUploadClick} title="העלה תמונה מהמחשב">
                <i className="bi bi-upload" style={{ marginLeft: 4 }}></i>העלה תמונה
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <span style={{ alignSelf: 'center', color: '#aaa', fontSize: 13 }}>או</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <i className="bi bi-link-45deg" style={{ color: '#ff7000' }}></i>
                <input
                  type="text"
                  placeholder="קישור לתמונה (URL)"
                  value={avatar}
                  onChange={e => setAvatar(e.target.value)}
                  className="propil-input"
                  style={{ minWidth: 0, width: 120 }}
                />
              </span>
                {/* כפתור התנתקות בתחתית הסרגל */}
                <div style={{ position: 'absolute', bottom: 20, left: 0, width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <button className="propil-logout-btn" onClick={handleLogout} title="התנתק" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#ff7000', fontSize: 18, cursor: 'pointer', padding: 0 }}>
                    <i className="bi bi-box-arrow-right" style={{ fontSize: 22 }}></i>
                    <span style={{ fontSize: 16 }}>התנתקות</span>
                  </button>
                </div>
              </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="bi bi-person-lines-fill" style={{ color: '#ff7000', fontSize: '1.3rem' }}></i>
            <input
              type="text"
              placeholder="שם מלא"
              value={name}
              onChange={e => setName(e.target.value)}
              className="propil-input"
              style={{ flex: 1 }}
            />
          </div>
          <button type="submit" className="propil-save-btn">
            <i className="bi bi-save" style={{ marginLeft: 6, fontSize: '1.2rem' }}></i>
            שמור
          </button>
        </form>

        {/* 🔥 תצוגת סל המועדפים */}
        <div className="favorites-section">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="bi bi-heart-fill" style={{ color: '#ff0077', fontSize: '1.1rem' }}></i>
            הכתבות שאהבת
          </h3>
          {favorites.length === 0 ? (
            <p style={{ color: '#888', fontSize: 15 }}><i className="bi bi-emoji-frown"></i> לא סימנת מועדפים עדיין.</p>
          ) : (
            <ul className="favorites-list">
              {favorites.map(article => (
                <li key={article.id} className="favorite-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <i className="bi bi-bookmark-star" style={{ color: '#ff7000', fontSize: '1.1rem' }}></i>
                    <strong>{article.title}</strong>
                    <div style={{ fontSize: '0.9em', color: '#666' }}>{article.reporterName}</div>
                  </div>
                  <button
                    className="remove-favorite-btn"
                    onClick={() => dispatch(removeFavorite(article.id))}
                    title="הסר מהמועדפים"
                  >
                    <i className="bi bi-x-circle"></i>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Propil;


















// import React, { useState } from 'react';
// import './propil.css';

// interface PropilProps {
//   user: { name: string; avatar: string };
//   setUser: (user: { name: string; avatar: string }) => void;
//   onClose: () => void;
// }

// const Propil: React.FC<PropilProps> = ({ user, setUser, onClose }) => {
//   const [name, setName] = useState(user.name);
//   const [avatar, setAvatar] = useState(user.avatar);

//   const handleSave = (e: React.FormEvent) => {
//     e.preventDefault();
//     setUser({ name, avatar });
//     onClose();
//   };

//   return (
//     <div className="propil-sidebar">
//       <button className="propil-close" onClick={onClose} title="סגור">×</button>
//       <div className="propil-content">
//         <h2>עריכת פרופיל</h2>
//         <form onSubmit={handleSave} className="propil-form">
//           <div className="propil-avatar-edit">
//             {avatar ? (
//               <img src={avatar} alt="avatar" className="propil-avatar-img" />
//             ) : (
//               <div className="propil-avatar">👤</div>
//             )}
//             <input
//               type="text"
//               placeholder="קישור לתמונה (URL)"
//               value={avatar}
//               onChange={e => setAvatar(e.target.value)}
//               className="propil-input"
//             />
//           </div>
//           <input
//             type="text"
//             placeholder="שם מלא"
//             value={name}
//             onChange={e => setName(e.target.value)}
//             className="propil-input"
//           />
//           <button type="submit" className="propil-save-btn">שמור</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Propil;
