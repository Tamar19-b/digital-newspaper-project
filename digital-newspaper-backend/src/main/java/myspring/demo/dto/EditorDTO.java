package myspring.demo.dto;
import java.util.List;

import lombok.Data;

@Data
public class EditorDTO {
    private String name;
    private int idEditor; //מזהה עורך
    private String email; //אימייל עורך
    private String password; //סיסמה עורך
    private List<ArticleDTO> articles; //רשימת המאמרים הממתינים לאישור
    private String propil;

}



