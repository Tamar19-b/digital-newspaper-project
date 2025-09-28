package myspring.demo.dal;

import java.util.List;


import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;



import myspring.demo.model.Article;
import myspring.demo.model.ArticleStatus;

//באופן זה הממשק  ידוע כממשק שמייצג אובייקט גישה לנתונים
//יודע ליצור אוטומטית מופע של מחלקה המממשת את הממשק //IoC//ה
//לכן לממשק זה, בשונה מהממשקעם בשכבות האחרות, לא ניצור מימוש
@Repository
public interface ArticleRepository extends CrudRepository<Article,Integer>
//ממשק האבא  מקבלת את טיפוס הנתונים עליו לעשות את הפעולות וכן את סוג המפתח
{
       List<Article> findBySectionIdSection(int sectionId);
    List<Article> findByStatus(ArticleStatus status);

  
     List<Article> findBySection_IdSectionAndStatus(int idSection, ArticleStatus status);
    // List<Article> findBySection_IdAndStatus(int sectionId, ArticleStatus status);

   // List<Article> findBySection_IdAndStatus(int idSection, ArticleStatus status);
    
}

