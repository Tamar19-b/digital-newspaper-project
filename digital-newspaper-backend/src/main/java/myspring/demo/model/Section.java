package myspring.demo.model;

import jakarta.persistence.*;
import lombok.Data;
//import java.util.List;


@Entity
@Table
@Data
public class Section {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idSection; // : מפתח ראשי של המדור

    @Column(nullable = false)
    private String name; // שם המדור

    //@OneToMany(mappedBy = "section")
   // private List<Article> articles; // רשימת המאמרים השייכים למדור זה
}