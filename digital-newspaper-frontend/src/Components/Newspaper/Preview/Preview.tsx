import React from 'react';
import { useSelector } from 'react-redux';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Preview.css';
import type { Article } from '../../ReporterHome/index';

import newsLogo from '../../../assets/sections/news.png';
import weatherLogo from '../../../assets/sections/Weather.png';
import childrenLogo from '../../../assets/sections/children.png';
import famelLogo from '../../../assets/sections/famel.png';
import economyLogo from '../../../assets/sections/Economy.png';

import MoodCamera from './MoodCamera';
import ArticleReactions from './ArticleReactions';
import CommentsSection from './CommentsSection'; // קומפוננטה חדשה

interface Props {
  article: Article & { propilReporter?: string; reporterName?: string };
  onClose: () => void;
}

const Preview: React.FC<Props> = ({ article, onClose }) => {
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const userId = currentUser?.id;
  const userName = currentUser?.name || localStorage.getItem('userName') || '';
  const userImage = currentUser?.image || localStorage.getItem('userImage') || '';

  const sectionColors: Record<string, string> = {
    חדשות: 'red',
    ילדים: 'gold',
    נשים: 'pink',
    כלכלה: 'green',
    'מזג-אויר': 'skyblue',
  };
  const sectionLogos: Record<string, string> = {
    חדשות: newsLogo,
    ילדים: childrenLogo,
    נשים: famelLogo,
    כלכלה: economyLogo,
    'מזג-אויר': weatherLogo,
  };
  const secColor = sectionColors[article.sectionName] || '#000';
  const secLogo = sectionLogos[article.sectionName] || newsLogo;

  const t = new Date(article.publishedAt);
  const now = new Date();
  const isToday = t.toDateString() === now.toDateString();
  const hoursAgo = Math.floor((now.getTime() - t.getTime()) / 3600000);

  return (
    <div className="preview-overlay">
      <div className="preview-box">
        <div className="preview-header-bar">
          <button className="close-button" onClick={onClose}>✕</button>
          <img src={secLogo} alt={article.sectionName} className="preview-section-logo" />
          <h1 style={{ color: secColor, margin: 0, flex: 1, textAlign: 'right' }}>{article.title}</h1>
        </div>

        <div className="preview-footer">
          <span className={`preview-time ${isToday ? 'highlight-time' : ''}`}>
            {isToday ? `לפני ${hoursAgo} שעות` : t.toLocaleDateString('he-IL')}
          </span>
          <div className="preview-reporter">
            {article.propilReporter ? (
              <img src={article.propilReporter} alt="כתב" className="preview-reporter-img" />
            ) : (
              <div className="preview-reporter-initial">{article.reporterName?.[0] || '?'}</div>
            )}
            <span>{article.reporterName || 'כתב'}</span>
          </div>
        </div>

        <h2 className="preview-subtitle">{article.subType}</h2>
        {article.imge || article.text ? (
          <div className="preview-article-content">
            {article.imge && <img src={article.imge} alt="תמונה" className="preview-image-float" />}
            <div className="preview-text">{article.text}</div>
            <div style={{ clear: 'both' }} />
          </div>
        ) : null}

        <ArticleReactions
          articleId={article.idArticle!}
          initialLikes={article.likeCount ?? 0}
          initialDislikes={article.dislikeCount ?? 0}
          initialViews={article.views ?? 0}
        />

        <MoodCamera onShareComment={async (text) => {
          if (!userId) return alert('עליך להתחבר לפני שליחת תגובה.');
          try {
            const res = await fetch(`http://localhost:8080/comments/add`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                articleId: article.idArticle,
                text,
                userId,
                name: userName,
                image: userImage,
              }),
            });
            if (!res.ok) throw new Error('שגיאה בשליחת תגובה');
          } catch (err) {
            console.error(err);
          }
        }} />

      
        <CommentsSection articleId={article.idArticle!} />
      </div>
    </div>
  );
};

export default Preview;
