import React, { useState } from 'react';
import Preview from '../Preview/Preview';
import type { Article } from '../../ReporterHome/index';
import './CardA.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { addFavorite, removeFavorite } from '../../../store/slices/favoritesSlice';
import { showMessage } from '../../../store/slices/messageSlice';

interface Props {
  article: Article & { reporterName: string; propilReporter: string };
}

const CardA: React.FC<Props> = ({ article }) => {
  const [showPreview, setShowPreview] = useState(false);

  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.items);

  const articleId = article.idArticle ?? 0;
  const isLiked = favorites.some((a) => a.id === articleId);

  const t = new Date(article.publishedAt);
  const now = new Date();
  const isToday = t.toDateString() === now.toDateString();
  const hoursAgo = Math.floor((now.getTime() - t.getTime()) / 3600000);

  const toggleFavorite = () => {
    if (isLiked) {
      dispatch(removeFavorite(articleId));
      dispatch(showMessage({ type: 'success', text: 'הוסרת מהמועדפים' }));
    } else {
      dispatch(addFavorite({
        id: articleId,
        title: article.title,
        text: article.text,
        imge: article.imge ?? '', // אם אין תמונה, שים מחרוזת ריקה
        reporterName: article.reporterName,
        propilReporter: article.propilReporter, // כאן כבר תמיד string
        publishedAt: article.publishedAt,
      }));
      dispatch(showMessage({ type: 'success', text: 'נוספת למועדפים' }));
    }
  };

  // הכנת article ל-Preview
  const articleForPreview = {
    ...article,
    imge: article.imge ?? '',
    propilReporter: article.propilReporter || '', // תמיד string
    reporterName: article.reporterName || 'כתב לא ידוע',
  };

  return (
    <>
      <div className="card-a" style={{ position: 'relative' }}>
        {article.imge ? (
          <div className="card-image-container">
            <img src={article.imge} alt={article.title} className="card-image" />
          </div>
        ) : (
          <div className="cardA-no-image">אין תמונה</div>
        )}
        <div className="cardA-body">
          <div
            className="cardA-heart"
            onClick={toggleFavorite}
            title={isLiked ? 'הסר מהמועדפים' : 'הוסף למועדפים'}
          >
            <i
              className={`bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'}`}
              style={{ fontSize: '1.2rem', cursor: 'pointer', transition: 'color 0.2s' }}
            ></i>
          </div>
          <h3 className="cardA-title">{article.title}</h3>
          <p className="cardA-subtitle">{article.text.slice(0, 80)}…</p>
          <div className="cardA-footer">
            <span className={`cardA-time ${isToday ? 'highlight-time' : ''}`}>
              {isToday ? `לפני ${hoursAgo} שעות` : t.toLocaleDateString('he-IL')}
            </span>
            <div className="cardA-author">
              <span>{article.reporterName}</span>
              <img
                src={article.propilReporter || '/default-avatar.png'}
                alt="כתב"
                className="cardA-avatar"
              />
            </div>
          </div>
          <button className="read-more-button" onClick={() => setShowPreview(true)}>
            <i className="bi bi-eyeglasses"></i> קרא עוד
          </button>
        </div>
      </div>

      {showPreview && (
        <Preview article={articleForPreview} onClose={() => setShowPreview(false)} />
      )}
    </>
  );
};

export default CardA;





































// import React, { useState } from 'react';
// import Preview from '../Preview/Preview';
// import type { Article } from '../../ReporterHome/index';
// import './CardA.css';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../../../store'
// import { addFavorite, removeFavorite } from '../../../redux/favoritesSlice';
// import { showMessage } from '../../redux/messageSlice';

// interface Props {
//   article: Article & { propilReporter: string; reporterName: string };
// }

// const CardA: React.FC<Props> = ({ article }) => {
//   const [showPreview, setShowPreview] = useState(false);

//   const dispatch = useDispatch();
//   const favorites = useSelector((state: RootState) => state.favorites.items);

//   const isLiked = favorites.some((a) => a.title === article.title);

//   const toggleFavorite = () => {
//     if (isLiked) {
//       dispatch(removeFavorite(article));
//       dispatch(showMessage({ type: 'success', text: 'הוסרת מהמועדפים' }));
//     } else {
//       dispatch(addFavorite(article));
//       dispatch(showMessage({ type: 'success', text: 'נוספת למועדפים' }));
//     }
//   };

//   const t = new Date(article.publishedAt);
//   const now = new Date();
//   const isToday = t.toDateString() === now.toDateString();
//   const hoursAgo = Math.floor((now.getTime() - t.getTime()) / 3600000);

//   return (
//     <>
//       <div className="card-a">
//         {article.imge ? (
//           <div className="card-image-container">
//             <img src={article.imge} alt={article.title} className="card-image" />
//           </div>
//         ) : (
//           <div className="cardA-no-image">אין תמונה</div>
//         )}
//         <div className="cardA-body">
//           <div
//             className="cardA-heart"
//             onClick={toggleFavorite}
//             title={isLiked ? 'הסר מהמועדפים' : 'הוסף למועדפים'}
//           >
//             <i
//               className={`bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'}`}
//               style={{
//                 fontSize: '1.2rem',
//                 cursor: 'pointer',
//                 transition: 'color 0.2s',
//               }}
//             ></i>
//           </div>
//           <h3 className="cardA-title">{article.title}</h3>
//           <p className="cardA-subtitle">{article.text.slice(0, 80)}…</p>
//           <div className="cardA-footer">
//             <span className={`cardA-time ${isToday ? 'highlight-time' : ''}`}>
//               {isToday ? `לפני ${hoursAgo} שעות` : t.toLocaleDateString('he-IL')}
//             </span>
//             <div className="cardA-author">
//               <img src={article.propilReporter} alt="כתב" className="cardA-avatar" />
//               <span>{article.reporterName}</span>
//             </div>
//           </div>
//           <button className="read-more-button" onClick={() => setShowPreview(true)}>
//             <i className="bi bi-eyeglasses"></i> קרא עוד
//           </button>
//         </div>
//       </div>

//       {showPreview && (
//         <Preview article={article} onClose={() => setShowPreview(false)} />
//       )}
//     </>
//   );
// };

// export default CardA;


































//import React, { useState } from 'react';
// import Preview from '../Preview/Preview';
// import type { Article } from '../../ReporterHome/index';
// import './CardA.css';

// interface Props {
//   article: Article & { propilReporter: string; reporterName: string };
// }

// const CardA: React.FC<Props> = ({ article }) => {
//   const [showPreview, setShowPreview] = useState(false);
//   const [liked, setLiked] = useState(false);
//   const t = new Date(article.publishedAt);
//   const now = new Date();
//   const isToday = t.toDateString() === now.toDateString();
//   const hoursAgo = Math.floor((now.getTime() - t.getTime()) / 3600000);
//   return (
//     <>
//       <div className="card-a">
//         {article.imge ? (
//           <div className="card-image-container">
//             <img src={article.imge} alt={article.title} className="card-image" />
//           </div>
//         ) : (
//           <div className="cardA-no-image">אין תמונה</div>
//         )}
//         <div className="cardA-body">
//           <div className="cardA-heart" onClick={() => setLiked(l => !l)} title={liked ? 'הסר מהאהובים' : 'הוסף למועדפים'}>
//             <i className={`bi ${liked ? 'bi-heart-fill' : 'bi-heart'}`} style={{ fontSize: '1.2rem', cursor: 'pointer', transition: 'color 0.2s' }}></i>
//           </div>
//           <h3 className="cardA-title">{article.title}</h3>
//           <p className="cardA-subtitle">{article.text.slice(0, 80)}…</p>
//           <div className="cardA-footer">
//             <span className={`cardA-time ${isToday ? 'highlight-time' : ''}`}>
//               {isToday ? `לפני ${hoursAgo} שעות` : t.toLocaleDateString('he-IL')}
//             </span>
//             <div className="cardA-author">
//               <img src={article.propilReporter} alt="כתב" className="cardA-avatar" />
//               <span>{article.reporterName}</span>
//             </div>
//           </div>
//           <button className="read-more-button" onClick={() => setShowPreview(true)}>
//             <i className="bi bi-eyeglasses"></i> קרא עוד
//           </button>
//         </div>
//       </div>
//       {showPreview && (
//         <Preview
//           article={article}
//           onClose={() => setShowPreview(false)}
//         />
//       )}
//     </>
//   );
// };

// export default CardA;

