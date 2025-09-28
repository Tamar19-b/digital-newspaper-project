
import EditoreHeader from './Header/Header';
import KPIBox from './KPIBox/KPIBox';
import ArticlesList from './ArticlesList/ArticlesList';
import EditArticleModal from '../EditArticleModal/EditArticleModal';

import { EyeFill, CheckCircleFill, PencilSquare, ExclamationCircleFill, Search } from 'react-bootstrap-icons';

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ReporterHome.css';

import type { ReporterData, Article, EditorData } from './index';
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



const EditorHome = () => {
  const { email } = useParams<{ email: string }>();
  const [editor, setEditor] = useState<EditorData | null>(null);
  const [error, setError] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isNewArticle, setIsNewArticle] = useState<boolean>(false);
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [placeholder, setPlaceholder] = useState('');
  // ✅ שליפת נתונים עם סינון לפי סטטוס SUBMITTED
  const fetchEditorData = async () => {
    try {
      if (!email) throw new Error('Email missing');

      const res = await fetch(`http://localhost:8080/Editors/getByEmail/${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error('Failed fetching editor data');

      const data = await res.json();
      const submittedArticles = data.articles.filter(
        (article: Article) => article.status === 'SUBMITTED'
      );

      submittedArticles.sort(
        (a: Article, b: Article) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setEditor({
        ...data,
        articles: submittedArticles,
      });
      console.log(data);

    } catch (err) {
      console.error(err);
      setError('שגיאה בטעינת הנתונים');
    }
  };
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
  // ✅ polling כל 5 שניות (5000 מילי־שניות)
  useEffect(() => {
    fetchEditorData(); // שליפה ראשונית

    // const interval = setInterval(() => {
    //   fetchEditorData();
    // }, 5000);

    // return () => clearInterval(interval); // ניקוי הטיימר ברגע שהקומפוננטה נהרסת
  }, [email]);




  const handleReject = async (article: Article) => {
    if (!article.idArticle) return;

    try {
      const updated = { ...article, status: 'DRAFT', subType: "gggg" };

      const res = await fetch(`http://localhost:8080/Articles/update/${article.idArticle}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error('Failed to update article');

      await fetchEditorData();
      alert('הכתבה נדחתה בהצלחה');
    } catch (error) {
      console.error('Error while rejecting article:', error);
      alert('שגיאה בדחיית הכתבה');
    }
  };

  const handleUpdateNewspaper = async (article: Article) => {
    if (!article.idArticle) return;

    try {
      const updated = { ...article, status: 'PUBLISHED', subType: "gggg" };

      const res = await fetch(`http://localhost:8080/Articles/update/${article.idArticle}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error('Failed to update article');

      await fetchEditorData();
      alert('הכתבה פורסמה בהצלחה');
    } catch (error) {
      console.error('Error while publishing article:', error);
      alert('שגיאה בפרסום הכתבה');
    }
  };

  const handleSaveFromEditor = async (updated: Article) => {
    try {
      const now = new Date().toISOString();
      const payload = {
        ...updated,
        lastModified: now,
        publishedAt: updated.status === 'PUBLISHED' ? now : updated.publishedAt,
      };

      const res = await fetch(`http://localhost:8080/Articles/update/${updated.idArticle}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      await fetchEditorData();
      setSelectedArticle(null);
    } catch (err) {
      alert('שגיאה בעדכון הכתבה');
      console.error(err);
    }
  };

  const handle_NOT_Approve = async (article: Article) => {
    if (!article.idArticle) return;

    const updated = {
      ...article,
      status: 'NOT_APPROVED',
      editorApproval: false,
      lastModified: new Date().toISOString(),
    };

    try {
      const res = await fetch(`http://localhost:8080/Articles/update/${article.idArticle}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error();

      await fetchEditorData();
    } catch (err) {
      alert('שגיאה בדחיית הכתבה');
      console.error(err);
    }
  };

  const handleView = (article: Article) => {
    setSelectedArticle(article);
    setIsNewArticle(false);
  };

  // סינון כתבות לפי סטטוס, מדור וחיפוש
  const filteredArticles = (editor?.articles || [])
    .filter((a: Article) =>
      (selectedStatus === 'all' ? true : a.status === selectedStatus)
      && (selectedSection === 'all' ? true : a.sectionName === SECTION_NAMES[selectedSection as ArticleSection])
      && (searchTerm.trim() === '' ? true : (
        a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.text?.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    ) || [];



  return (
    <div className="reporter-container">
  <EditoreHeader name={editor?.nameE ?? "עורך"} />
      <KPIBox
        stats={[
          {
            icon: <ExclamationCircleFill />,
            label: 'ממתינות לבדיקה',
            value: editor?.articles.length || 0,
            color: 'red',
            labelClass: 'label-red',
          },
          {
            icon: <CheckCircleFill />,
            label: 'פורסמו היום',
            value: 10,
            color: 'green',
            labelClass: 'label-green',
          },
          {
            icon: <EyeFill />,
            label: 'צפיות השבוע',
            value: '12K',
            color: 'blue',
            labelClass: 'label-blue',
          },
          {
            icon: <ExclamationCircleFill />,
            label: 'לא אושרו היום',
            value: 3,
            color: 'orange',
            labelClass: 'label-orange',
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

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ArticlesList
        articles={filteredArticles}
        onEdit={setSelectedArticle}
        onApprove={handleUpdateNewspaper}
        onReject={handleReject}
        onView={handleView}
        mode="editor"
      />

      {selectedArticle && (
        <EditArticleModal
          article={selectedArticle}
          isNew={isNewArticle}
          onClose={() => {
            setSelectedArticle(null);
            setIsNewArticle(false);
          }}
          onSave={handleSaveFromEditor}
          mode="editor"
        />
      )}
    </div>
  );
};

export default EditorHome;






















// import EditoreHeader from './Header/Header';
// import KPIBox from './KPIBox/KPIBox';
// import ArticlesList from './ArticlesList/ArticlesList';
// import EditArticleModal from '../EditArticleModal/EditArticleModal';

// import { EyeFill, CheckCircleFill, ExclamationCircleFill, Search } from 'react-bootstrap-icons';

// import 'bootstrap/dist/css/bootstrap.min.css';
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import './ReporterHome.css';

// import type { ReporterData, Article, EditorData } from './index';

// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../../store';  // נתיב לפי מבנה הפרויקט שלך
// import { setArticles, updateArticle, triggerSync } from '../../store/slices/articlesSlice';

// type ArticleSection = 'news' | 'women' | 'children' | 'weather' | 'economy';

// const SECTION_NAMES: Record<ArticleSection, string> = {
//   news: 'חדשות',
//   women: 'נשים',
//   children: 'ילדים',
//   weather: 'מזג-אויר',
//   economy: 'כלכלה',
// };

// const EditorHome = () => {
//   const { email } = useParams<{ email: string }>();
//   const [editor, setEditor] = useState<EditorData | null>(null);
//   const [error, setError] = useState('');
//   const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
//   const [isNewArticle, setIsNewArticle] = useState<boolean>(false);
//   const [selectedSection, setSelectedSection] = useState<string>('all');
//   const [selectedStatus, setSelectedStatus] = useState<string>('all');
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [placeholder, setPlaceholder] = useState('');

//   const dispatch = useDispatch();
//   const lastUpdatedToggle = useSelector((state: RootState) => state.articles.lastUpdatedToggle);
//   const articles = useSelector((state: RootState) => state.articles.items);


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


// useEffect(() => {
//   const fetchEditorData = async () => {
//     try {
//       if (!email) throw new Error('Email missing');

//       const res = await fetch(`http://localhost:8080/Editors/getByEmail/${encodeURIComponent(email)}`);
//       if (!res.ok) throw new Error('Failed fetching editor data');

//       const data = await res.json();
//       const submittedArticles = data.articles.filter((article: Article) => article.status === 'SUBMITTED');

//       submittedArticles.sort(
//         (a: Article, b: Article) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//       );

//       setEditor({ ...data, articles: submittedArticles });
//       dispatch(setArticles(submittedArticles));
//     } catch (err) {
//       console.error(err);
//       setError('שגיאה בטעינת הנתונים');
//     }
//   };

//   fetchEditorData();
// }, [email, dispatch, lastUpdatedToggle]);



// const handleReject = async (article: Article) => {
//   if (!article.idArticle) return;
//   try {
//     const updated = { ...article, status: 'DRAFT', subType: "gggg" };
//     const res = await fetch(`http://localhost:8080/Articles/update/${article.idArticle}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(updated),
//     });
//     if (!res.ok) throw new Error();
//     dispatch(updateArticle(updated));
//     dispatch(triggerSync()); // עדכון טוגל לגרום לרענון אוטומטי
//     alert('הכתבה נדחתה בהצלחה');
//   } catch (err) {
//     console.error(err);
//     alert('שגיאה בדחיית הכתבה');
//   }
// };


// const handleUpdateNewspaper = async (article: Article) => {
//   if (!article.idArticle) return;
//   try {
//     const updated = { ...article, status: 'PUBLISHED', subType: "gggg" };
//     const res = await fetch(`http://localhost:8080/Articles/update/${article.idArticle}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(updated),
//     });
//     if (!res.ok) throw new Error();
//     dispatch(updateArticle(updated));
//     dispatch(triggerSync()); // עדכון טוגל
//     alert('הכתבה פורסמה בהצלחה');
//   } catch (err) {
//     console.error(err);
//     alert('שגיאה בפרסום הכתבה');
//   }
// };

// const handleSaveFromEditor = async (updated: Article) => {
//   try {
//     const now = new Date().toISOString();
//     const payload = {
//       ...updated,
//       lastModified: now,
//       publishedAt: updated.status === 'PUBLISHED' ? now : updated.publishedAt,
//     };
//     const res = await fetch(`http://localhost:8080/Articles/update/${updated.idArticle}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload),
//     });
//     if (!res.ok) throw new Error();
//     dispatch(updateArticle(payload));
//     dispatch(triggerSync()); // עדכון טוגל
//     setSelectedArticle(null);
//   } catch (err) {
//     alert('שגיאה בעדכון הכתבה');
//     console.error(err);
//   }
// };

//   const handleView = (article: Article) => {
//     setSelectedArticle(article);
//     setIsNewArticle(false);
//   };

// const filteredArticles = articles.filter(a =>
//   (selectedStatus === 'all' || a.status === selectedStatus) &&
//   (selectedSection === 'all' || a.sectionName === SECTION_NAMES[selectedSection as ArticleSection]) &&
//   (searchTerm.trim() === '' || a.title?.toLowerCase().includes(searchTerm.toLowerCase()) || a.text?.toLowerCase().includes(searchTerm.toLowerCase()))
// );


//   return (
//     <div className="reporter-container">
//       <EditoreHeader title="לוח העורכים" />
//       <KPIBox
//         stats={[
//           { icon: <ExclamationCircleFill />, label: 'ממתינות לבדיקה', value: editor?.articles.length || 0, color: 'red', labelClass: 'label-red' },
//           { icon: <CheckCircleFill />, label: 'פורסמו היום', value: 10, color: 'green', labelClass: 'label-green' },
//           { icon: <EyeFill />, label: 'צפיות השבוע', value: '12K', color: 'blue', labelClass: 'label-blue' },
//           { icon: <ExclamationCircleFill />, label: 'לא אושרו היום', value: 3, color: 'orange', labelClass: 'label-orange' },
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
//         onApprove={handleUpdateNewspaper}
//         onReject={handleReject}
//         onView={handleView}
//         mode="editor"
//       />
//       {selectedArticle && (
//         <EditArticleModal
//           article={selectedArticle}
//           isNew={isNewArticle}
//           onClose={() => {
//             setSelectedArticle(null);
//             setIsNewArticle(false);
//           }}
//           onSave={handleSaveFromEditor}
//           mode="editor"
//         />
//       )}
//     </div>
//   );
// };

// export default EditorHome;



































