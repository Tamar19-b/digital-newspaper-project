package myspring.demo.dto;

import java.util.List;

import lombok.Data;

@Data
public class ReporterDTO {
    private String name;
    private int idReporter; 
    private String email;
    private String password; 
    private String profileImageName;
    private String propil;
    private SectionDTO section;
    private List<ArticleDTO> articles;
 }