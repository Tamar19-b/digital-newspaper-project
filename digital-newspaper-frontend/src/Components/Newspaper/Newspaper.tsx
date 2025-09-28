import React, { useEffect, useState } from 'react';
import './Newspaper.css';
import type { Article } from '../ReporterHome/index';
import HeaderN from './headerN/headerN';
import LastArticle from './LastArticle.tsx/LastArticle'
import ListCardA from './ListCardA/ListCardA';

interface ExtArticle extends Article {
  propil: string;
  propilReporter: string;
  reporterName: string;
}

const PAGE_SIZE = 20;

const NewspaperPage: React.FC = () => {
  const [articles, setArticles] = useState<ExtArticle[]>([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0); // כמה דפים יוצגו
  const [loading, setLoading] = useState(false);
  // טען משתמש מה-localStorage כברירת מחדל
  const [user, setUser] = useState(() => ({
    name: localStorage.getItem('userName') || 'ישראל ישראלי',
    avatar: localStorage.getItem('userImage') || '',
  }));

  // עדכן את המשתמש בכל פתיחה מחדש של העמוד (למקרה ששונה בפרופיל)
  useEffect(() => {
    setUser({
      name: localStorage.getItem('userName') || 'ישראל ישראלי',
      avatar: localStorage.getItem('userImage') || '',
    });
  }, []);

  // קריאה לשרת שמחזירה את כל הכתבות (ללא פאגינציה/חיפוש בשרת)
  const fetchAllArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/Articles/getAll');
      const data: Article[] = await res.json();
      // סנן וסדר את הכתבות
      const filteredSorted = data
        .filter(a => a.status === 'PUBLISHED')
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

      // השתמש בפרופיל שמגיע עם כל כתבה
      const articlesWithProfile = filteredSorted.map((a) => ({
        ...a,
        propil: a.propilReporter || '',
        propilReporter: a.propilReporter || '',
        reporterName: a.reporterName || '',
      }));
      setArticles(articlesWithProfile);
      setError('');
    } catch {
      setError('שגיאה בטעינת כתבות');
    } finally {
      setLoading(false);
    }
  };

  // חיפוש ופאגינציה בקליינט
  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paged = filtered.slice(0, (page + 1) * PAGE_SIZE);
  const [last, ...rest] = paged;
  const hasMore = paged.length < filtered.length;

  useEffect(() => {
    fetchAllArticles();
    setPage(0);
    // eslint-disable-next-line
  }, [searchTerm]);

  return (
    <div className="newspaper-container">
      <HeaderN searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user} setUser={setUser} />
      {last && <LastArticle article={last} />}
      {error && <p className="error">{error}</p>}
      {rest.length > 0 && <ListCardA articles={rest} />}
      {loading && <p>טוען...</p>}
      {hasMore && !loading && (
        <button
          className="btn btn-outline-primary d-block mx-auto mt-3"
          style={{ fontSize: '2rem', borderRadius: '50%', width: 56, height: 56, padding: 0 }}
          onClick={() => setPage(p => p + 1)}
          aria-label="הצג עוד כתבות"
        >
          <i className="bi bi-plus"></i>
        </button>
      )}
      {!hasMore && !loading && (
        <p style={{textAlign: 'center', color: '#888'}}>הגעת לסוף הרשימה</p>
      )}
    </div>
  );
};

export default NewspaperPage;