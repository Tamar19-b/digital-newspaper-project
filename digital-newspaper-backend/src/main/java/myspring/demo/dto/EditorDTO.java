package myspring.demo.dto;
import java.util.List;

import lombok.Data;

@Data
public class EditorDTO {
    private String name;
    private int idEditor; 
    private String email;
    private String password; 
    private List<ArticleDTO> articles; 
    private String propil;

}



