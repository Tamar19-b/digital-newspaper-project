import React from 'react';
import './CreateArticleButton.css';

interface Props {
  onCreate: () => void;
}

const CreateArticleButton: React.FC<Props> = ({ onCreate }) => {
  return (
    <div className="create-article-button" onClick={onCreate}>
      + כתבה חדשה
    </div>
  );
};

export default CreateArticleButton;
