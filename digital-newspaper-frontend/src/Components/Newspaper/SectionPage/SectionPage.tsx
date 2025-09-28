import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HeaderN from '../headerN/headerN';
import LastArticle from '../LastArticle.tsx/LastArticle';
import ListCardA from '../ListCardA/ListCardA';
import type { Article } from '../../ReporterHome/index';

import './SectionPage.css';

interface ExtArticle extends Article {
  propilReporter: string;
  reporterName: string;
}

// מיפוי בין שם מדור ל-id
const sectionNameToId: Record<string, number> = {
  נשים: 7,
  ילדים: 5,
  חדשות: 1,
  'מזג-אויר': 2,
  כלכלה: 8,
};

const backgroundColors: Record<string, string> = {
  נשים: '#ffe6f0',
  ילדים: '#fffbe6',
  חדשות: '#ffeeee',
  'מזג-אויר': '#e6f7ff',
  כלכלה: ' #98d672;',
};

const SectionPage: React.FC = () => {
  const { section } = useParams<{ section: string }>();
  const [articles, setArticles] = useState<ExtArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  // סטייט משתמש בסיסי
  const [user, setUser] = useState({
    name: 'ישראל ישראלי',
    avatar: '',
  });

  useEffect(() => {
    console.log('--- useEffect start ---');
    console.log('param section from URL:', section);
    fetchArticles();
  }, [section]);

  // קריאה לשרת עם sectionId כמספר
  const fetchArticles = async () => {
    try {
      const sectionId = sectionNameToId[section!];
      if (!sectionId) {
        setArticles([]);
        return;
      }
      const res = await fetch(`http://localhost:8080/Articles/getBySectionAndStatus?sectionId=${sectionId}&status=PUBLISHED`);
      const data: Article[] = await res.json();
      console.log('Fetched articles from server:', data);

      const mapped = data
        .map(a => ({
          ...a,
          propilReporter: a.propilReporter || '',
          reporterName: a.reporterName || '',
        }))
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

      console.log('Mapped articles:', mapped);
      setArticles(mapped);
    } catch (err) {
      console.error('שגיאה בטעינת כתבות:', err);
    }
  };

  // סינון רק לפי חיפוש טקסט
  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [last, ...rest] = filtered;

  console.log('Final filtered articles after search:', filtered);
  console.log('Last article:', last);
  console.log('Remaining articles:', rest);

  return (
    <div
      className="section-page"
      style={{ backgroundColor: backgroundColors[section!] || '#f4f6f9' }}
    >
      <HeaderN searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user} setUser={setUser} />
      {last && <LastArticle article={last} />}
        <h1 className="section-title">{section}</h1>
      {rest.length > 0 ? (
        <ListCardA articles={rest} />
      ) : (
        <p className="no-articles-msg">לא נמצאו כתבות נוספות במדור זה</p>
      )}
    </div>
  );
};

export default SectionPage;
