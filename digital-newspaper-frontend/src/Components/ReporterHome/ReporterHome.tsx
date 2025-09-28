

import ReporterHeader from './Header/Header';
import KPIBox from './KPIBox/KPIBox';
import ArticlesList from './ArticlesList/ArticlesList';
import EditArticleModal from '../EditArticleModal/EditArticleModal';

import { EyeFill, CheckCircleFill, PencilSquare, ExclamationCircleFill, Search } from 'react-bootstrap-icons';


import { Calendar, User, MessageCircle, Heart } from 'lucide-react';

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ReporterHome.css';



import type { ReporterData, Article } from './index';

// Define the possible section keys (update as needed)
type ArticleSection = 'news' | 'women' | 'children' | 'weather' | 'economy';

// Hebrew names for each section
const SECTION_NAMES: Record<ArticleSection, string> = {
  news: 'חדשות',
  women: 'נשים',
  children: 'ילדים',
  weather: 'מזג-אויר',
  economy: 'כלכלה',
};

// Tailwind/Bootstrap color classes for each section (update as needed)
const SECTION_COLORS: Record<ArticleSection, string> = {
  news: 'bg-blue-200 text-blue-800 border-blue-400',
  women: 'bg-pink-200 text-pink-800 border-pink-400',
  children: 'bg-yellow-200 text-yellow-800 border-yellow-400',
  weather: 'bg-cyan-200 text-cyan-800 border-cyan-400',
  economy: 'bg-green-200 text-green-800 border-green-400',
};

const ReporterHome = () => {
  const { email } = useParams<{ email: string }>();
  const [reporter, setReporter] = useState<ReporterData | null>(null);
  const [error, setError] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isNewArticle, setIsNewArticle] = useState<boolean>(false);
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [placeholder, setPlaceholder] = useState('');

  // אפקט אנימציה ל-placeholder שחוזר בלולאה
  useEffect(() => {
    const text = 'חפש כתבות...';
    let i = 0;
    let forward = true;
    let timeout: NodeJS.Timeout;
    function typeLoop() {
      setPlaceholder(text.slice(0, i));
      if (forward) {
        if (i < text.length) {
          i++;
          timeout = setTimeout(typeLoop, 90);
        } else {
          forward = false;
          timeout = setTimeout(typeLoop, 1200); // השהייה בסוף
        }
      } else {
        if (i > 0) {
          i--;
          timeout = setTimeout(typeLoop, 40);
        } else {
          forward = true;
          timeout = setTimeout(typeLoop, 400);
        }
      }
    }
    typeLoop();
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const fetchReporterData = async () => {
      try {
        if (!email) throw new Error('Email missing');
        const res = await fetch(
          `http://localhost:8080/Reporters/getByEmail/${encodeURIComponent(email)}`
        );
        if (!res.ok) throw new Error('Failed fetching reporter data');
        const data = await res.json();
        data.articles.sort(
          (a: Article, b: Article) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setReporter(data);
      } catch (err) {
        console.error(err);
        setError('שגיאה בטעינת הנתונים');
      }
    };

    fetchReporterData();
  }, [email]);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      const res = await fetch(`http://localhost:8080/Articles/delete/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      setReporter((prev) =>
        prev ? { ...prev, articles: prev.articles.filter((a) => a.idArticle !== id) } : prev
      );
    } catch {
      alert('שגיאה במחיקת הכתבה');
    }
  };

  const handleSend = async (article: Article) => {
    if (!article.idArticle) return;

    try {
      const updated = { ...article, status: 'SUBMITTED' };

      const res = await fetch(`http://localhost:8080/Articles/update/${article.idArticle}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error('Failed to update article');

      setReporter((prev) =>
        prev
          ? {
            ...prev,
            articles: prev.articles.map((a) =>
              a.idArticle === article.idArticle ? updated : a
            ),
          }
          : prev
      );
    } catch (error) {
      console.error('Error while submitting article:', error);
      alert('שגיאה בשליחת הכתבה לעורך');
    }
  };

const handleSave = async (updated: Article) => {
  try {
    console.log("📤 התחלת שמירה של כתבה", updated);

    const url = isNewArticle
      ? 'http://localhost:8080/Articles/add'
      : `http://localhost:8080/Articles/update/${updated.idArticle}`;
    const method = isNewArticle ? 'POST' : 'PUT';

    console.log(`🔗 URL: ${url}`);
    console.log(`🔧 METHOD: ${method}`);

    const now = new Date().toISOString();

    const updatedPayload = {
      ...updated,
      createdAt: updated.createdAt || now,
      lastModified: now,
      publishedAt: updated.publishedAt || now,
      reporterId: updated.reporterId,
    };

    console.log("📦 Payload שנשלח לשרת:", updatedPayload);

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPayload),
    });

    console.log(`📥 תגובת שרת: ${res.status} ${res.statusText}`);

    if (!res.ok) {
      const errText = await res.text();
      console.error("❌ שגיאת שרת:", errText);
      throw new Error("Server response not OK");
    }

    if (isNewArticle) {
      const newArticle = await res.json();
      console.log("✅ כתבה חדשה שנוצרה בהצלחה:", newArticle);

      setReporter((prev) =>
        prev ? { ...prev, articles: [newArticle, ...prev.articles] } : prev
      );
    } else {
      console.log("✏️ עדכון כתבה קיים");

      setReporter((prev) =>
        prev
          ? {
              ...prev,
              articles: prev.articles.map((a) =>
                a.idArticle === updated.idArticle ? updatedPayload : a
              ),
            }
          : prev
      );
    }

    setSelectedArticle(null);
    setIsNewArticle(false);
    console.log("✅ שמירה הסתיימה בהצלחה");

  } catch (err) {
   
    console.error("🛑 שגיאה כללית:", err);
  }
};


  const handleCreateNew = () => {
    setIsNewArticle(true);
    setSelectedArticle({
      title: '',
      text: '',
      status: 'DRAFT',
      createdAt: '',
      type: '',
      subType: '',
      sectionId: reporter?.section.idSection ?? 0,
      sectionName: reporter?.section.name ?? '',
      reporterId: reporter?.id,
      reporterName: reporter?.name ?? '',
      reporterApproval: false,
      editorApproval: false,
      lastModified: '',
      publishedAt: '',
      editorId: null,
      editorName: null,
      imge:null,

      likeCount: null,
      dislikeCount: null,
      views: null,
    });
  };



  // סינון כתבות לפי סטטוס, מדור וחיפוש
  const filteredArticles = (reporter?.articles || [])
  .filter((a) =>
    (selectedStatus === 'all' ? true : a.status === selectedStatus)
    && (selectedSection === 'all' ? true : a.sectionName === SECTION_NAMES[selectedSection as ArticleSection])
    && (searchTerm.trim() === '' ? true : (
      a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.text?.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  ) || [];

  // פונקציה שמקצרת מספרים כמו ביוטיוב
function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'T'; // טריליון
  } else if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'; // מיליון
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'; // אלף
  }
  return num.toString();
}


  return (
    <div className="reporter-container">
  <ReporterHeader name={reporter?.name ?? "כתב"} />

      <KPIBox
        stats={[
          {
            icon: <EyeFill />,
            label: 'צפיות השבוע',
            value: reporter
              ? formatNumber(
                  reporter.articles.reduce(
                    (sum, article) => sum + (article.views ?? 0),
                    0
                  )
                )
              : 0,
            color: 'blue',
            labelClass: 'label-blue',
          }
,
          {
            icon: <CheckCircleFill />,
            label: 'פורסמו  ',
            value: reporter?.articles.filter((a) => a.status === 'PUBLISHED').length || 0,
            color: 'green',
            labelClass: 'label-green',
          },
          {
            icon: <PencilSquare />,
            label: 'בכתיבה',
            value: reporter?.articles.filter((a) => a.status === 'DRAFT').length || 0,
            color: 'orange',
            labelClass: 'label-orange',
          },
          {
            icon: <ExclamationCircleFill />,
            label: 'ממתינות לבדיקה',
            value: reporter?.articles.filter((a) => a.status === 'SUBMITTED').length || 0,
            color: 'red',
            labelClass: 'label-red',
          },
        ]}
        filterBar={
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', gap: 12, width: '100%' }}>
              <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} style={{ marginTop: '15px' }}>
                <option value="all">כל הסטטוסים</option>
                <option value="DRAFT">טיוטה</option>
                <option value="SUBMITTED">נשלחה</option>
                <option value="PUBLISHED">פורסמה</option>
              </select>
              <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)} style={{ marginTop: '15px' }}>
                <option value="all">כל המדורים</option>
                {(Object.keys(SECTION_NAMES) as ArticleSection[]).map((section) => (
                  <option key={section} value={section}>{SECTION_NAMES[section]}</option>
                ))}
              </select>
              <div className="search-input-wrapper">
                <input
                  type="search"
                  placeholder={placeholder}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <span className="search-icon-inside">
                  <Search />
                </span>
              </div>
            </div>
          </div>
        }
      />

           {/* Section Filter
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setSelectedSection('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedSection === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              כל המדורים
            </button>
            {(Object.keys(SECTION_NAMES) as ArticleSection[]).map((section) => (
              <button
                key={section}
                onClick={() => setSelectedSection(section)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                  selectedSection === section
                    ? SECTION_COLORS[section].replace('bg-', 'bg-').replace('text-', 'text-').replace('border-', 'border-')
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                {SECTION_NAMES[section]}
              </button>
            ))}
          </div> */}
   

      {error && <p style={{ color: 'red' }}>{error}</p>}
       
  
      <ArticlesList
          articles={filteredArticles}
          onEdit={setSelectedArticle}
          onDelete={handleDelete}
          onSend={handleSend}
          handleCreateNew={handleCreateNew}
          mode="reporter"
        />


      {selectedArticle && (
        <EditArticleModal
          article={selectedArticle}
          isNew={isNewArticle}
          onClose={() => {
            setSelectedArticle(null);
            setIsNewArticle(false);
          }}
          onSave={handleSave}
           mode="reporter"
        />
      )}
    </div>
  );
};

export default ReporterHome;





























































































// ReporterHome.tsx - גרסה מתוקנת עם שימוש מלא ב-Redux לכתבות בלבד

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';

// import ReporterHeader from './Header/Header';
// import KPIBox from './KPIBox/KPIBox';
// import ArticlesList from './ArticlesList/ArticlesList';
// import EditArticleModal from '../EditArticleModal/EditArticleModal';

// import { EyeFill, CheckCircleFill, PencilSquare, ExclamationCircleFill, Search } from 'react-bootstrap-icons';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './ReporterHome.css';

// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../../store';
// import { setArticles, addArticle, updateArticle, deleteArticle, triggerSync } from '../../store/slices/articlesSlice';

// import type { ReporterData, Article } from './index';

// type ArticleSection = 'news' | 'women' | 'children' | 'weather' | 'economy';

// const SECTION_NAMES: Record<ArticleSection, string> = {
//   news: 'חדשות',
//   women: 'נשים',
//   children: 'ילדים',
//   weather: 'מזג-אויר',
//   economy: 'כלכלה',
// };

// const ReporterHome = () => {
//   const { email } = useParams<{ email: string }>();
//   const dispatch = useDispatch();

//   // הכתבות רק מה-Redux
//   const articles = useSelector((state: RootState) => state.articles.items);
//   const lastUpdatedToggle = useSelector((state: RootState) => state.articles.lastUpdatedToggle);

//   // פרטי הכתב (ללא הכתבות)
//   const [reporter, setReporter] = useState<Omit<ReporterData, 'articles'> | null>(null);
//   const [error, setError] = useState('');
//   const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
//   const [isNewArticle, setIsNewArticle] = useState<boolean>(false);
//   const [selectedSection, setSelectedSection] = useState<string>('all');
//   const [selectedStatus, setSelectedStatus] = useState<string>('all');
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [placeholder, setPlaceholder] = useState('');

//   // אנימציית Placeholder לחיפוש
//   useEffect(() => {
//     const text = 'חפש כתבות...';
//     let i = 0;
//     let forward = true;
//     let timeout: NodeJS.Timeout;
//     function typeLoop() {
//       setPlaceholder(text.slice(0, i));
//       if (forward) {
//         if (i < text.length) {
//           i++;
//           timeout = setTimeout(typeLoop, 90);
//         } else {
//           forward = false;
//           timeout = setTimeout(typeLoop, 1200);
//         }
//       } else {
//         if (i > 0) {
//           i--;
//           timeout = setTimeout(typeLoop, 40);
//         } else {
//           forward = true;
//           timeout = setTimeout(typeLoop, 400);
//         }
//       }
//     }
//     typeLoop();
//     return () => clearTimeout(timeout);
//   }, []);

//   // טעינת פרטי הכתב והכתבות (רק פעם אחת או כש-lastUpdatedToggle משתנה)
//   useEffect(() => {
//     const fetchReporterData = async () => {
//       try {
//         if (!email) throw new Error('Email missing');
//         const res = await fetch(`http://localhost:8080/Reporters/getByEmail/${encodeURIComponent(email)}`);
//         if (!res.ok) throw new Error('Failed fetching reporter data');
//         const data: ReporterData = await res.json();

//         // מיין כתבות לפי תאריך יצירה יורד
//         data.articles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

//         // שמור רק את פרטי הכתב בלי הכתבות ב-state מקומי
//         const { articles, ...reporterInfo } = data;
//         setReporter(reporterInfo);

//         // תעדכן את הכתבות ב-Redux
//         dispatch(setArticles(articles));
        
//         console.log('Reporter data loaded:', reporterInfo);
//       } catch (err) {
//         console.error(err);
//         setError('שגיאה בטעינת הנתונים');
//       }
//     };

//     fetchReporterData();
//   }, [email, dispatch, lastUpdatedToggle]);

//   // מחיקת כתבה
//   const handleDelete = async (id?: number) => {
//     if (!id) return;
//     try {
//       const res = await fetch(`http://localhost:8080/Articles/delete/${id}`, { method: 'DELETE' });
//       if (!res.ok) throw new Error();
//       dispatch(deleteArticle(id));
//       dispatch(triggerSync()); // טריגר לעדכון מחדש
//     } catch {
//       alert('שגיאה במחיקת הכתבה');
//     }
//   };

//   // שליחת כתבה לעורך (שינוי סטטוס ל-SUBMITTED)
//   const handleSend = async (article: Article) => {
//     if (!article.idArticle) return;
//     try {
//       const updated = { ...article, status: 'SUBMITTED' };
//       const res = await fetch(`http://localhost:8080/Articles/update/${article.idArticle}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updated),
//       });
//       if (!res.ok) throw new Error();
//       dispatch(updateArticle(updated));
//       dispatch(triggerSync()); // טריגר לעדכון מחדש
//     } catch (error) {
//       alert('שגיאה בשליחת הכתבה לעורך');
//     }
//   };

//   // שמירת כתבה (עדכון או יצירה)
//   const handleSave = async (updated: Article) => {
//     try {
//       const url = isNewArticle ? 'http://localhost:8080/Articles/add' : `http://localhost:8080/Articles/update/${updated.idArticle}`;
//       const method = isNewArticle ? 'POST' : 'PUT';
//       const now = new Date().toISOString();
//       const payload = {
//         ...updated,
//         createdAt: updated.createdAt || now,
//         lastModified: now,
//         publishedAt: updated.publishedAt || now,
//         reporterId: updated.reporterId,
//       };
//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });
//       if (!res.ok) throw new Error();
//       if (isNewArticle) {
//         const newArticle = await res.json();
//         dispatch(addArticle(newArticle));
//       } else {
//         dispatch(updateArticle(payload));
//       }
//       setSelectedArticle(null);
//       setIsNewArticle(false);
//       dispatch(triggerSync()); // טריגר לעדכון מחדש
//     } catch (err) {
//       alert('שגיאה בשמירת הכתבה');
//     }
//   };

//   // יצירת כתבה חדשה
//   const handleCreateNew = () => {
//     setIsNewArticle(true);
//     setSelectedArticle({
//       title: '',
//       text: '',
//       status: 'DRAFT',
//       createdAt: '',
//       type: '',
//       subType: '',
//       sectionId: reporter?.section.idSection ?? 0,
//       sectionName: reporter?.section.name ?? '',
//       reporterId: reporter?.id,
//       reporterName: reporter?.name ?? '',
//       reporterApproval: false,
//       editorApproval: false,
//       lastModified: '',
//       publishedAt: '',
//       editorId: null,
//       editorName: null,
//       imge: null,
//     });
//   };

//   // סינון הכתבות לפי סטטוס, מדור וחיפוש
//   const filteredArticles = articles.filter(a =>
//     (selectedStatus === 'all' || a.status === selectedStatus) &&
//     (selectedSection === 'all' || a.sectionName === SECTION_NAMES[selectedSection as ArticleSection]) &&
//     (searchTerm.trim() === '' ||
//       a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       a.text?.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   return (
//     <div className="reporter-container">
//       <ReporterHeader title="לוח הכתבים" />
//       <KPIBox
//         stats={[
//           { icon: <EyeFill />, label: 'צפיות השבוע', value: '2.4K', color: 'blue', labelClass: 'label-blue' },
//           { icon: <CheckCircleFill />, label: 'פורסמו היום', value: 190, color: 'green', labelClass: 'label-green' },
//           { icon: <PencilSquare />, label: 'בכתיבה', value: articles.filter(a => a.status === 'DRAFT').length, color: 'orange', labelClass: 'label-orange' },
//           { icon: <ExclamationCircleFill />, label: 'ממתינות לבדיקה', value: articles.filter(a => a.status === 'SUBMITTED').length, color: 'red', labelClass: 'label-red' },
//         ]}
//         filterBar={
//           <div style={{ width: '100%' }}>
//             <div style={{ display: 'flex', gap: 12, width: '100%' }}>
//               <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} style={{ marginTop: '15px' }}>
//                 <option value="all">כל הסטטוסים</option>
//                 <option value="DRAFT">טיוטה</option>
//                 <option value="SUBMITTED">נשלחה</option>
//                 <option value="PUBLISHED">פורסמה</option>
//               </select>
//               <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)} style={{ marginTop: '15px' }}>
//                 <option value="all">כל המדורים</option>
//                 {(Object.keys(SECTION_NAMES) as ArticleSection[]).map(section => (
//                   <option key={section} value={section}>{SECTION_NAMES[section]}</option>
//                 ))}
//               </select>
//               <div className="search-input-wrapper">
//                 <input type="search" placeholder={placeholder} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
//                 <span className="search-icon-inside"><Search /></span>
//               </div>
//             </div>
//           </div>
//         }
//       />
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <ArticlesList
//         articles={filteredArticles}
//         onEdit={setSelectedArticle}
//         onDelete={handleDelete}
//         onSend={handleSend}
//         handleCreateNew={handleCreateNew}
//         mode="reporter"
//       />
//       {selectedArticle && (
//         <EditArticleModal
//           article={selectedArticle}
//           isNew={isNewArticle}
//           onClose={() => {
//             setSelectedArticle(null);
//             setIsNewArticle(false);
//           }}
//           onSave={handleSave}
//           mode="reporter"
//         />
//       )}
//     </div>
//   );
// };

// export default ReporterHome;




















