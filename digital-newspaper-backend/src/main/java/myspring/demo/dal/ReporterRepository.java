package myspring.demo.dal;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import myspring.demo.model.Reporter;

//באופן זה הממשק  ידוע כממשק שמייצג אובייקט גישה לנתונים
//יודע ליצור אוטומטית מופע של מחלקה המממשת את הממשק //IoC//ה
//לכן לממשק זה, בשונה מהממשקעם בשכבות האחרות, לא ניצור מימוש
@Repository
public interface ReporterRepository extends CrudRepository<Reporter,Integer>
//ממשק האבא  מקבלת את טיפוס הנתונים עליו לעשות את הפעולות וכן את סוג המפתח
{
    Optional<Reporter> findByEmail(String email); // חשוב שיחזיר Optional
    
}