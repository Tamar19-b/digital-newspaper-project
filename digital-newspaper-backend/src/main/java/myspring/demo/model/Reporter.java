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
    private int idReporter;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = true)
    private String profileImageName; 
    
    @Lob
    @Column(nullable = true)
    private String propil;

     @ManyToOne
    @JoinColumn(name = "section_id", nullable = false)
    private Section section; 

    @OneToMany(mappedBy = "reporter")
    private List<Article> articles;

}
