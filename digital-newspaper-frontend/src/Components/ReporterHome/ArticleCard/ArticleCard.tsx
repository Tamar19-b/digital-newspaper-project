import React from 'react';
import { Button } from 'react-bootstrap';
import {
  PencilFill,
  TrashFill,
  SendFill,
  ExclamationCircleFill,
  CalendarFill, // הוספת אייקון לוח שנה
} from 'react-bootstrap-icons';
import './ArticleCard.css';

import { Article } from '../index';
import newsLogo from '../../../assets/sections/news.png'
import famelLogo from '../../../assets/sections/famel.png';
import childrenLogo from '../../../assets/sections/children.png';
import EconomyLogo from '../../../assets/sections/Economy.png';
import WeatherLogo from '../../../assets/sections/Weather.png';

interface Props {
  article: Article;
  onEdit: () => void;
  onDelete?: () => void;
  onSend?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  mode: 'reporter' | 'editor'; // מצב תצוגה
}


const getSectionLogo = (sectionName: string) => {
  const logos: { [key: string]: string } = {
    חדשות: newsLogo,
    נשים: famelLogo,
   'ילדים': childrenLogo,
    'מזג-אויר': WeatherLogo,
    כלכלה: EconomyLogo,
  };
  return logos[sectionName] || newsLogo;
};
const ArticleCard: React.FC<Props> = ({
  article,
  onEdit,
  onDelete,
  onSend,
  onApprove,
  onReject,
  mode,
}) => {
  // חישוב האם התאריך הוא היום והפרש השעות
  const lastModifiedValid = article.lastModified && !isNaN(new Date(article.lastModified).getTime());
  const lastModifiedDate = lastModifiedValid ? new Date(article.lastModified) : null;
  const now = new Date();
  const isToday = lastModifiedDate &&
    lastModifiedDate.getDate() === now.getDate() &&
    lastModifiedDate.getMonth() === now.getMonth() &&
    lastModifiedDate.getFullYear() === now.getFullYear();
  let hoursAgo = null;
  if (isToday && lastModifiedDate) {
    const diffMs = now.getTime() - lastModifiedDate.getTime();
    hoursAgo = Math.floor(diffMs / (1000 * 60 * 60));
  }

  return (
    <div
      className="article-card" style={{ opacity: mode === 'reporter' && article.status === 'SUBMITTED' ? 0.5 : 1 }}>
      {/* 🖼️ תמונה בראש */}
      <div className="article-image-container">
        {article.imge ? (
          <img src={article.imge} alt="תמונה מתוך הכתבה" className="article-image" />
        ) : (
          <div className="no-image-text">אין תמונה</div>
        )}
      </div>

      {/* 📦 תוכן הכרטיס */}
      <div className="article-content">

        {/* 🔝 שורה עליונה: סטטוס ולוגו + אייקון הערות */}
        <div className="article-meta-top">
          <span className="status">
            מצב: {
              article.status === 'DRAFT' ? 'טיוטה' :
                article.status === 'SUBMITTED' ? 'נשלחה' :
                  article.status === 'APPROVED' ? 'אושרה' :
                    article.status === 'REJECTED' ? 'לא אושרה' :
                      article.status === 'PUBLISHED' ? 'פורסמה' :
                        article.status
            }
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <img className="section-logo" src={getSectionLogo(article.sectionName)} alt={article.sectionName} />
          </div>
        </div>

        {/* 📰 כותרת */}
        <h3>{article.title}</h3>

        {/* ✏️ תמצית הטקסט */}
        <p style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal', maxWidth: '100%' }}>
          {article.text.slice(0, 80)}...
        </p>

        {/* 🎯 כפתורים */}
        <div className="actions">
          <Button className="action-btn bg-success-hover" onClick={onEdit}>
            <PencilFill className="me-2" />
            {mode === 'reporter' ? 'עריכה' : 'צפייה'}
          </Button>

          {mode === 'reporter' && (
            <>
              <Button className="action-btn bg-danger-hover" onClick={onDelete}>
                <TrashFill className="me-2" /> מחיקה
              </Button>
              <Button className="action-btn bg-primary-hover" onClick={onSend}>
                <SendFill className="me-2" /> שליחה לעורך
              </Button>
            </>
          )}

          {mode === 'editor' && (
            <>
              <Button className="action-btn bg-success-hover" onClick={onApprove}>
                ✅ פרסם
              </Button>
              <Button className="action-btn bg-danger-hover" onClick={onReject}>
                ❌ דחה
              </Button>
            </>
          )}
        </div>

        {/* 📅 תאריך ואייקון הערות בשורה אחת */}
        {lastModifiedDate && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <div className="date" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CalendarFill style={{ marginLeft: 4 }} />
              תאריך: {lastModifiedDate.toLocaleDateString('he-IL')}
              {isToday && (
                <span
                  style={{
                    color: '#0e63d2',
                    marginRight: 8,
                    fontWeight: 'bold',
                    fontSize: '16px',
                    paddingRight: 4,
                    letterSpacing: '0.5px',
                    background: 'rgba(14,99,210,0.07)',
                    borderRadius: '8px',
                    paddingLeft: 6,
                    paddingTop: 1,
                    paddingBottom: 1,
                    display: 'inline-block',
                  }}
                >
                  (לפני {hoursAgo === 0 ? 'פחות משעה' : `${hoursAgo} שעות`})
                </span>
              )}
            </div>
            {article.editorNotes && article.editorNotes.length > 0 && article.status !== 'PUBLISHED' && mode === 'reporter' && (
              <ExclamationCircleFill className="editor-note-icon blink-red" size={22} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleCard;