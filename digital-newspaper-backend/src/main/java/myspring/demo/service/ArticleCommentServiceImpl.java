package myspring.demo.service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import myspring.demo.dal.ArticleCommentRepository;
import myspring.demo.model.ArticleComment;

@Service
public class ArticleCommentServiceImpl implements ArticleCommentService {

    @Autowired
    private ArticleCommentRepository commentRepo;

    @Override
    public void addComment(ArticleComment comment) {
        comment.setCreatedAt(LocalDateTime.now());
        commentRepo.save(comment);
    }

    @Override
    public List<ArticleComment> getCommentsForArticle(int articleId) {
        return commentRepo.findByArticle_idArticle(articleId);
    }

}
