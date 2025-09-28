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
    private int idEditor;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @Lob
    @Column(nullable = true)
    private String propil;

    @OneToMany(mappedBy = "editor")
    private List<Article> pendingArticles; 
}