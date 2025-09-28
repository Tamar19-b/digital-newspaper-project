import React, { useEffect, useState } from 'react';

interface Props {
  articleId: number;
  initialLikes: number;
  initialDislikes: number;
  initialViews: number;
}

const ArticleReactions: React.FC<Props> = ({ articleId, initialLikes, initialDislikes, initialViews }) => {
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [dislikeCount, setDislikeCount] = useState(initialDislikes);
  const [views, setViews] = useState(initialViews);
  const [animateLike, setAnimateLike] = useState(false);

  // --- עדכון צפיות ---
  useEffect(() => {
    const addView = async () => {
      try {
        await fetch(`http://localhost:8080/Articles/view/${articleId}`, { method: 'PUT' });
        setViews(prev => prev + 1);
      } catch (err) {
        console.error("שגיאה בעדכון צפיות:", err);
      }
    };
    addView();
  }, [articleId]);

  // --- לייקים ודיסלייקים ---
  const handleReaction = async (id: number, type: 'like' | 'dislike') => {
    const likedArticles: number[] = JSON.parse(localStorage.getItem('likedArticles') || '[]');
    const dislikedArticles: number[] = JSON.parse(localStorage.getItem('dislikedArticles') || '[]');

    try {
      if (type === 'like') {
        if (likedArticles.includes(id)) {
          await fetch(`http://localhost:8080/Articles/unlike/${id}`, { method: 'PUT' });
          setLikeCount(prev => Math.max(0, prev - 1));
          likedArticles.splice(likedArticles.indexOf(id), 1);
        } else {
          await fetch(`http://localhost:8080/Articles/like/${id}`, { method: 'PUT' });
          if (dislikedArticles.includes(id)) {
            await fetch(`http://localhost:8080/Articles/undislike/${id}`, { method: 'PUT' });
            setDislikeCount(prev => Math.max(0, prev - 1));
            dislikedArticles.splice(dislikedArticles.indexOf(id), 1);
          }
          setLikeCount(prev => prev + 1);
          likedArticles.push(id);

          if (likeCount + 1 === 10) {
            setAnimateLike(true);
            setTimeout(() => setAnimateLike(false), 600);
          }
        }
      } else {
        if (dislikedArticles.includes(id)) {
          await fetch(`http://localhost:8080/Articles/undislike/${id}`, { method: 'PUT' });
          setDislikeCount(prev => Math.max(0, prev - 1));
          dislikedArticles.splice(dislikedArticles.indexOf(id), 1);
        } else {
          await fetch(`http://localhost:8080/Articles/dislike/${id}`, { method: 'PUT' });
          if (likedArticles.includes(id)) {
            await fetch(`http://localhost:8080/Articles/unlike/${id}`, { method: 'PUT' });
            setLikeCount(prev => Math.max(0, prev - 1));
            likedArticles.splice(likedArticles.indexOf(id), 1);
          }
          setDislikeCount(prev => prev + 1);
          dislikedArticles.push(id);
        }
      }
      localStorage.setItem('likedArticles', JSON.stringify(likedArticles));
      localStorage.setItem('dislikedArticles', JSON.stringify(dislikedArticles));
    } catch (err) {
      console.error("שגיאה בעדכון לייק/דיסלייק:", err);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '1.5rem', margin: '1rem 0', justifyContent: 'center', fontSize: '1.1rem' }}>
      <div
        className={`reaction-btn ${JSON.parse(localStorage.getItem('likedArticles') || '[]').includes(articleId) ? 'liked' : ''} ${animateLike ? 'like-explosion' : ''}`}
        onClick={() => handleReaction(articleId, 'like')}
      >
        <i className="bi bi-hand-thumbs-up"></i> {likeCount}
      </div>
      <div
        className={`reaction-btn ${JSON.parse(localStorage.getItem('dislikedArticles') || '[]').includes(articleId) ? 'disliked' : ''}`}
        onClick={() => handleReaction(articleId, 'dislike')}
      >
        <i className="bi bi-hand-thumbs-down"></i> {dislikeCount}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <i className="bi bi-eye"></i>
        <span>{views}</span>
        <span>צפיות</span>
      </div>
    </div>
  );
};

export default ArticleReactions;
