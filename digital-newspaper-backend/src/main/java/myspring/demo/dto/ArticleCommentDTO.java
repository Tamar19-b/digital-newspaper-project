package myspring.demo.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ArticleCommentDTO {
    private int id;
    private String text;
    private LocalDateTime createdAt;
    private int userId;
    private int articleId;
    private String name;
    private String image;
}
