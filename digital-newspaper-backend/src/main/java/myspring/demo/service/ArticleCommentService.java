package myspring.demo.service;

import java.util.List;
import myspring.demo.model.ArticleComment;

public interface ArticleCommentService {
    void addComment(ArticleComment comment);
    List<ArticleComment> getCommentsForArticle(int articleId);
     
}
