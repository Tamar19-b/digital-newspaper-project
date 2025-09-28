package myspring.demo.model;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table
@Data
public class Section {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idSection;

    @Column(nullable = false)
    private String name; 

    //@OneToMany(mappedBy = "section")
   // private List<Article> articles; // רשימת המאמרים השייכים למדור זה
}