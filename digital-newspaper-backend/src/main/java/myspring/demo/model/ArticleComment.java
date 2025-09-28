package myspring.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class ArticleComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String text;

    private LocalDateTime createdAt;

    @Column(nullable = false)
    private String name;
    
    @Column(nullable = true)
    private String image; 

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // המגיב

    @ManyToOne
    @JoinColumn(name = "article_id")
    private Article article; // הכתבה עליה הגיב
}
