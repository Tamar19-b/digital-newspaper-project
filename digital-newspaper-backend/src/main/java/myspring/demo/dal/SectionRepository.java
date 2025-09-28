package myspring.demo.dal;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


import myspring.demo.model.Section;

//באופן זה הממשק  ידוע כממשק שמייצג אובייקט גישה לנתונים
//יודע ליצור אוטומטית מופע של מחלקה המממשת את הממשק //IoC//ה
//לכן לממשק זה, בשונה מהממשקעם בשכבות האחרות, לא ניצור מימוש
@Repository
public interface SectionRepository extends CrudRepository<Section,Integer>
//ממשק האבא  מקבלת את טיפוס הנתונים עליו לעשות את הפעולות וכן את סוג המפתח
{
    //
}