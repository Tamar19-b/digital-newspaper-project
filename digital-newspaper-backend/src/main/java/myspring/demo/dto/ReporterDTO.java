package myspring.demo.dto;

import java.util.List;

import lombok.Data;

@Data
public class ReporterDTO {
    private String name;
    private int idReporter; //מזהה כתב
    private String email; //אימייל כתב
    private String password; //סיסמה כתב
    private String profileImageName;
    private String propil;
    private SectionDTO section;// סוג המדור של הכתב
    private List<ArticleDTO> articles;// רשימת המאמרים של הכתב
 }