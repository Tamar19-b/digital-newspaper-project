import React from 'react';
import CardA from '../CardA/CardA';
import type { Article } from '../../ReporterHome/index';
import './ListCardA.css';

interface Props {
  articles: (Article & { propilReporter: string; reporterName: string })[];
}

const ListCardA: React.FC<Props> = ({ articles }) => (
  <div className="list-card-a">
    {articles.map(a => (
      <CardA key={a.idArticle} article={a} />
    ))}
  </div>
);

export default ListCardA;

