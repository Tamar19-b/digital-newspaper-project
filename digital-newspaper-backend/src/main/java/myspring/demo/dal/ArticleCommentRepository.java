package myspring.demo.dal;

import java.util.List;
import org.springframework.data.repository.CrudRepository;
import myspring.demo.model.ArticleComment;

public interface ArticleCommentRepository extends CrudRepository<ArticleComment, Integer> {
    List<ArticleComment> findByArticle_idArticle(int articleId);
}
