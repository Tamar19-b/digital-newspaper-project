package myspring.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;


@Entity
@Table
@Data
public class Reporter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idReporter;// מפתח ראשי

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String password;// סיסמה

    @Column(nullable = false, unique = true)
    private String email;// דוא"ל ייחודי

    @Column(nullable = true)
    private String profileImageName; // שם הקובץ של התמונה
    
    @Lob
    @Column(nullable = true)
    private String propil;

     @ManyToOne
    @JoinColumn(name = "section_id", nullable = false)
    private Section section; // סוג המדור של הכתב

    @OneToMany(mappedBy = "reporter")
    private List<Article> articles;

}
