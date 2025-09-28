import React from 'react';
import ArticleCard from '../ArticleCard/ArticleCard'
import { Article } from '../index';
import './ArticlesList.css';
import CreateArticleButton from '../CreateArticleButton/CreateArticleButton';
interface Props {
  articles: Article[];
  onEdit: (a: Article) => void;
  onApprove?: (a: Article) => void;
  onReject?: (a: Article) => void;
  onView?: (a: Article) => void; // ✅ הוספת onView
  onDelete?: (id?: number) => void;
  onSend?: (a: Article) => void;
  handleCreateNew?: () => void;
  mode: "reporter" | "editor";
}



const ArticlesList: React.FC<Props> = ({
  articles,
  onEdit,
  onDelete,
  onSend,
  onApprove,
  onReject,
  handleCreateNew,
  mode,
}) => (
  <div className='title-article-list'>
    <div className="articles-top-bar">
      <h4 className="articles-title" style={{ textAlign: 'right', marginLeft: '0', marginRight: '0' }}>
        {mode === 'reporter' ? 'הכתבות שלי' : 'כתבות שנשלחו לבדיקה'}
      </h4>
      {mode === 'reporter' && handleCreateNew && (
        <CreateArticleButton onCreate={handleCreateNew} />
      )}
    </div>
    <div className='articles-divider'></div>
    <div className="articles-list-vertical">
      {articles.map((article) => (
        <ArticleCard
          key={article.idArticle}
          article={article}
          onEdit={() => onEdit(article)}
          onDelete={onDelete ? () => onDelete(article.idArticle) : undefined}
          onSend={onSend ? () => onSend(article) : undefined}
          onApprove={onApprove ? () => onApprove(article) : undefined}
          onReject={onReject ? () => onReject(article) : undefined}
          mode={mode}
        />
      ))}
    </div>
  </div>
);

export default ArticlesList;
