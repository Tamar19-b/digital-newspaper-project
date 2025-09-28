package myspring.demo.dal;
import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import myspring.demo.model.Article;
import myspring.demo.model.ArticleStatus;


@Repository
public interface ArticleRepository extends CrudRepository<Article,Integer>

{
    List<Article> findBySectionIdSection(int sectionId);
    List<Article> findByStatus(ArticleStatus status);

  
     List<Article> findBySection_IdSectionAndStatus(int idSection, ArticleStatus status);
    // List<Article> findBySection_IdAndStatus(int sectionId, ArticleStatus status);
    // List<Article> findBySection_IdAndStatus(int idSection, ArticleStatus status);
    
}

