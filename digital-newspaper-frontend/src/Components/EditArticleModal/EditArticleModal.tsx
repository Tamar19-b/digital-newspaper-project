import React, { useState, useEffect } from "react";
import "./EditArticleModal.css";

interface Article {
  idArticle?: number;
  type: string;
  subType: string;
  title: string;
  text: string;
  reporterApproval: boolean;
  editorApproval: boolean;
  status: string;
  createdAt: string;
  lastModified: string;
  publishedAt: string;
  sectionId: number;
  sectionName: string;
  reporterId?: number;
  reporterName?: string;
  propilReporter?: string | null;
  editorId?: number | null;
  editorName?: string | null;
  editorNotes?: string | null;
  imge?: string | null;
  likeCount: number | null;
  dislikeCount: number | null;
  views: number | null;
}

interface EditArticleModalProps {
  article: Article;
  isNew: boolean;
  onClose: () => void;
  onSave: (updatedArticle: Article) => void;
  mode: "reporter" | "editor";
}

const EditArticleModal: React.FC<EditArticleModalProps> = ({
  article,
  isNew,
  onClose,
  onSave,
  mode,
}) => {
  const getInitialArticle = (article: Article): Article => {
    if (!article.idArticle) {
      const propilReporter = localStorage.getItem("propilReporter");
      return { ...article, propilReporter: propilReporter || "" };
    }
    return article;
  };

  const [editedArticle, setEditedArticle] = useState<Article>(
    getInitialArticle(article)
  );
  const isEditor = mode === "editor";

  useEffect(() => {
    setEditedArticle(getInitialArticle(article));
  }, [article]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditedArticle((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    let newSectionId = 0;

    switch (newType) {
      case "נשים":
        newSectionId = 7;
        break;
      case "ילדים":
        newSectionId = 5;
        break;
      case "מזג-אויר":
        newSectionId = 2;
        break;
      case "כלכלה":
        newSectionId = 8;
        break;
      case "חדשות":
        newSectionId = 1;
        break;
      default:
        newSectionId = 0;
    }

    setEditedArticle((prev) => ({
      ...prev,
      type: newType,
      sectionName: newType,
      sectionId: newSectionId,
    }));
  };

  const handleSave = () => {
    const now = new Date().toISOString();
    console.log("🔗 propilReporter שנשלח:", editedArticle.propilReporter);

    onSave({
      ...editedArticle,
      createdAt: editedArticle.createdAt || now,
      lastModified: now,
      publishedAt: editedArticle.publishedAt || now,
      reporterApproval: editedArticle.reporterApproval ?? false,
      editorApproval: editedArticle.editorApproval ?? false,
      editorId: editedArticle.editorId ?? null,
      editorName: editedArticle.editorName ?? null,
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="custom-modal-content">
        <h2>{isNew ? "כתבה חדשה" : "עריכת כתבה"}</h2>

        {/* כותרת */}
        <label>כותרת:</label>
        {isEditor ? (
          <div className="readonly-field">{editedArticle.title}</div>
        ) : (
          <input
            type="text"
            name="title"
            value={editedArticle.title}
            onChange={handleChange}
            className="full-width"
          />
        )}

        {/* תוכן */}
        <label>תוכן:</label>
        {isEditor ? (
          <div className="readonly-field">{editedArticle.text}</div>
        ) : (
          <textarea
            name="text"
            rows={10}
            value={editedArticle.text}
            onChange={handleChange}
            className="full-width"
          />
        )}

        {/* קטגוריה */}
        <label>קטגוריה:</label>
        {isEditor ? (
          <div className="readonly-field">{editedArticle.sectionName}</div>
        ) : (
          <select
            name="type"
            value={editedArticle.type}
            onChange={handleTypeChange}
          >
            <option value="">בחר קטגוריה</option>
            <option value="נשים">נשים</option>
            <option value="ילדים">ילדים</option>
            <option value="מזג-אויר">מזג-אויר</option>
            <option value="כלכלה">כלכלה</option>
            <option value="חדשות">חדשות</option>
          </select>
        )}

        {/* תמונה */}
        <label>תמונה:</label>
        {isEditor ? (
          editedArticle.imge ? (
            <img
              src={editedArticle.imge}
              alt="תמונה מהכתבה"
              className="preview-img"
            />
          ) : (
            <div className="readonly-field">אין תמונה</div>
          )
        ) : (
          <>
            {editedArticle.imge && (
              <img
                src={editedArticle.imge}
                alt="תצוגה מקדימה"
                className="preview-img"
              />
            )}
            <div className="upload-wrapper">
              <input
                type="file"
                id="fileUpload"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setEditedArticle((prev) => ({
                      ...prev,
                      imge: reader.result as string,
                    }));
                  };
                  reader.readAsDataURL(file);
                }}
              />
              <label htmlFor="fileUpload" className="upload-btn">
                העלה תמונה מהמחשב
              </label>
            </div>

            <input
              type="text"
              name="imge"
              placeholder="או הדבק כתובת תמונה"
              value={editedArticle.imge ?? ""}
              onChange={(e) =>
                setEditedArticle({ ...editedArticle, imge: e.target.value })
              }
              style={{ marginTop: "0.5rem" }}
            />
          </>
        )}

        {/* הערות העורך */}
        <label>הערות העורך:</label>
        {isEditor ? (
          <textarea
            name="editorNotes"
            rows={10}
            value={editedArticle.editorNotes ?? ""}
            onChange={handleChange}
            className="full-width"
          />
        ) : (
          <div className="readonly-field">{editedArticle.editorNotes}</div>
        )}

        {/* מזהים */}
        {!isEditor && (
          <div className="input-row">
            <div className="short-input">
              <label>מזהה עורך:</label>
              <input
                type="number"
                name="editorId"
                value={editedArticle.editorId ?? ""}
                onChange={(e) =>
                  setEditedArticle((prev) => ({
                    ...prev,
                    editorId: parseInt(e.target.value) || null,
                  }))
                }
              />
            </div>

            <div className="short-input">
              <label>שם עורך:</label>
              <input
                type="text"
                name="editorName"
                value={editedArticle.editorName ?? ""}
                onChange={(e) =>
                  setEditedArticle((prev) => ({
                    ...prev,
                    editorName: e.target.value,
                  }))
                }
              />
            </div>

            <div className="short-input">
              <label>מזהה כתב:</label>
              <input
                type="number"
                name="reporterId"
                value={editedArticle.reporterId ?? ""}
                onChange={(e) =>
                  setEditedArticle((prev) => ({
                    ...prev,
                    reporterId: parseInt(e.target.value),
                  }))
                }
              />
            </div>
          </div>
        )}

        <div className="modal-buttons">
          <button onClick={handleSave}>שמירה</button>
          <button className="cancel" onClick={onClose}>
            ביטול
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditArticleModal;
