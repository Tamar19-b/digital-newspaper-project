package myspring.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table
@Data
public class Editor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idEditor;// מפתח ראשי של העורך

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String password;// סיסמה של העורך

    @Column(nullable = false, unique = true)
    private String email;// דוא"ל ייחודי של העורך

    @Lob
    @Column(nullable = true)
    private String propil;

    @OneToMany(mappedBy = "editor")
    private List<Article> pendingArticles; // מזהי כתבות שממתינות לאישור
}