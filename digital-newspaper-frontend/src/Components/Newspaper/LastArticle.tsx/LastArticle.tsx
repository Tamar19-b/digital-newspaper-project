import React from 'react';
import './LastArticle.css';
import type { Article } from '../../ReporterHome/index'

interface Props {
  article: Article;
}

const LastArticle: React.FC<Props> = ({ article }) => {
  return (
    <div className="last-article-container">
      {article.imge && (
        <img src={article.imge} alt={article.title} className="background-image" />
      )}

      <div className="last-article-content">
        <h1 className="last-article-title">{article.title}</h1>
        <p className="last-article-snippet">{article.text.slice(0, 160)}...</p>
        <button className="read-more-button">קרא עוד</button>
      </div>
    </div>
  );
};

export default LastArticle;
