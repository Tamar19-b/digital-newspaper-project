import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface Comment {
  id: number;
  userName?: string;
  userImage?: string;
  name?: string;
  image?: string;
  text: string;
  createdAt: string;
}

interface Props {
  articleId: number;
}

const CommentsSection: React.FC<Props> = ({ articleId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [sending, setSending] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const userId = currentUser?.id;
  const userName = currentUser?.name || localStorage.getItem('userName') || '';
  const userImage = currentUser?.image || localStorage.getItem('userImage') || '';

  // שליפת תגובות
  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:8080/comments/byArticle/${articleId}`);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      if (Array.isArray(data)) {
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setComments(sorted);
      } else {
        setComments([]);
      }
    } catch {
      setError('שגיאה בטעינת תגובות');
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showComments) fetchComments();
  }, [showComments, articleId]);

  // שליחת תגובה חדשה
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!userId) return alert('עליך להתחבר לפני שליחת תגובה.');
    setSending(true);
    try {
      const res = await fetch(`http://localhost:8080/comments/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          text: newComment,
          userId,
          name: userName,
          image: userImage,
        }),
      });
      if (!res.ok) throw new Error('שגיאה בשליחת תגובה');
      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="preview-comments-section">
      <button
        className="toggle-comments-btn"
        onClick={() => setShowComments(v => !v)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '1.1rem',
          color: '#1a237e',
          fontWeight: 600,
          marginBottom: '1rem',
          direction: 'rtl',
        }}
        aria-expanded={showComments}
        aria-controls="comments-list"
      >
        <i className={`bi ${showComments ? 'bi-chat-dots-fill' : 'bi-chat-dots'}`} style={{ fontSize: '1.5rem' }}></i>
        {showComments ? 'הסתר חוות דעת' : 'הצג חוות דעת של קוראים'}
      </button>

      {showComments && (
        <>
          <h3 className="comments-title">חוות דעת של קוראים</h3>
          <form
            className="add-comment-form"
            onSubmit={handleAddComment}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}
            autoComplete="off"
          >
            <input
              className="add-comment-input"
              type="text"
              placeholder="כתוב תגובה..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              maxLength={300}
              disabled={sending}
              style={{ flex: 1 }}
            />
            <button
              className="add-comment-btn"
              type="submit"
              disabled={sending || !newComment.trim()}
              title="שלח תגובה"
              style={{ minWidth: 0, padding: '0.45rem 1rem', fontSize: '1rem', borderRadius: '50px' }}
            >
              <i className="bi bi-send add-comment-icon" style={{ fontSize: '1.3rem', margin: 0 }}></i>
            </button>
          </form>

          <div className="comments-list" id="comments-list">
            {loading ? (
              <div className="comment-placeholder">טוען תגובות...</div>
            ) : error ? (
              <div className="comment-placeholder">{error}</div>
            ) : comments.length > 0 ? (
              comments.map(comment => {
                const displayName = comment.userName || comment.name || 'משתמש';
                let displayImage = comment.userImage || comment.image || '';
                let borderColor = '';
                if (!displayImage) {
                  const colors = [
                    '#ff9800', '#1976d2', '#43a047', '#d32f2f', '#8e24aa',
                    '#fbc02d', '#00897b', '#c2185b', '#5d4037', '#7b1fa2',
                  ];
                  borderColor = colors[(displayName.charCodeAt(0) + comment.id) % colors.length];
                  displayImage = '';
                }

                return (
                  <div className="comment-item" key={comment.id}>
                    <div className="comment-header">
                      {displayImage ? (
                        <img src={displayImage} alt={displayName} className="comment-user-img" />
                      ) : (
                        <div className="comment-user-initial" style={{ borderColor }}>
                          {displayName[0] || '?'}
                        </div>
                      )}

                      <div className="comment-user-info">
                        <span className="comment-user">{displayName}</span>
                        <span className="comment-date">
                          {new Date(comment.createdAt).toLocaleString('he-IL')}
                        </span>
                      </div>
                    </div>
                    <div className="comment-content">{comment.text}</div>
                  </div>
                );
              })
            ) : (
              <div className="comment-placeholder">
                אין עדיין חוות דעת. היו הראשונים להגיב!
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CommentsSection;
