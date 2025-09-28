package myspring.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import myspring.demo.dal.ArticleRepository;
import myspring.demo.model.Article;
import myspring.demo.model.ArticleStatus;

@Service
public class ArticleServiceImpl implements ArticleService {
    // יודע להזריק את המופע המתאים לכאן //IoC //באופן זה
    @Autowired
    private ArticleRepository rep;

    @Override
    public void addArticle(Article a) {
        if (rep.existsById(a.getIdArticle()))
            throw new RuntimeException(
                    "Cannot add Article with the code " + a.getIdArticle() + " because it already exists.");
        rep.save(a);
    }

    @Override
    public void updateArticle(Article a) {
        if (!rep.existsById(a.getIdArticle()))
            throw new RuntimeException(
                    "Cannot update Article with the code " + a.getIdArticle() + " because it does not exist.");
        rep.save(a);
    }

    @Override
    public void deleteArticle(int idArticle) {
        rep.deleteById(idArticle);
    }

    @Override
    public List<Article> getAll() {
        return (List<Article>) rep.findAll();
    }

    @Override
    public Article getByCodeArticle(int idArticle) {
        return rep.findById(idArticle).get();
    }

    @Override
    public List<Article> getBySection(int sectionId) {
        return rep.findBySectionIdSection(sectionId);
    }

    @Override
    public List<Article> getByStatus(ArticleStatus status) {
        return rep.findByStatus(status);
    }

    @Override
    public List<Article> getBySectionAndStatus(int sectionId, ArticleStatus status) {
        return rep.findBySection_IdSectionAndStatus(sectionId, status);
    }
    
    // 🆕 פונקציות לייק/דיסלייק וצפיות
    @Override
    public void incrementLike(int idArticle) {
        Article a = getByCodeArticle(idArticle);
        if (a != null) {
            a.setLikeCount(a.getLikeCount() + 1);
            rep.save(a);
        }
    }

    @Override
    public void decrementLike(int idArticle) {
        Article a = getByCodeArticle(idArticle);
        if (a != null && a.getLikeCount() > 0) {
            a.setLikeCount(a.getLikeCount() - 1);
            rep.save(a);
        }
    }

    @Override
    public void incrementDislike(int idArticle) {
        Article a = getByCodeArticle(idArticle);
        if (a != null) {
            a.setDislikeCount(a.getDislikeCount() + 1);
            rep.save(a);
        }
    }

    @Override
    public void decrementDislike(int idArticle) {
        Article a = getByCodeArticle(idArticle);
        if (a != null && a.getDislikeCount() > 0) {
            a.setDislikeCount(a.getDislikeCount() - 1);
            rep.save(a);
        }
    }

    @Override
    public void incrementViews(int idArticle) {
        Article a = getByCodeArticle(idArticle);
        if (a != null) {
            a.setViews(a.getViews() + 1);
            rep.save(a);
        }
    }

}