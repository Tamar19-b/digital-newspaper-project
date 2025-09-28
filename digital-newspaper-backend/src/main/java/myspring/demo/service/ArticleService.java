package myspring.demo.service;


import java.util.List;


import myspring.demo.model.Article;
import myspring.demo.model.ArticleStatus;

public interface ArticleService {
    void addArticle(Article a);
    void updateArticle(Article a);
    void deleteArticle(int idArticle);
    List<Article> getAll();
    Article getByCodeArticle(int idArticle);
     List<Article> getBySection(int sectionId);
    List<Article> getByStatus(ArticleStatus status);
    List<Article> getBySectionAndStatus(int sectionId, ArticleStatus status);

    // 🆕 פונקציות לייק/דיסלייק וצפיות
    void incrementLike(int idArticle);
    void decrementLike(int idArticle);
    void incrementDislike(int idArticle);
    void decrementDislike(int idArticle);
    void incrementViews(int idArticle);
}
