package myspring.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "article")
@Data
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idArticle;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String title;

    @Lob
    @Column(nullable = true)
    private String imge;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String text;

    private boolean reporterApproval;
    private boolean editorApproval;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ArticleStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime lastModified;
    private LocalDateTime publishedAt;

    @ManyToOne
    @JoinColumn(name = "section_id", nullable = false)
    private Section section;

    @ManyToOne
    @JoinColumn(name = "editor_id", nullable = true)
    private Editor editor;

    @ManyToOne
    @JoinColumn(name = "reporter_id", nullable = false)
    private Reporter reporter;

    @Column(nullable = true, columnDefinition = "TEXT")
    private String editorNotes;

    @Column(nullable = false)
    private int likeCount = 0;

    @Column(nullable = false)
    private int dislikeCount = 0;

    @Column(nullable = false)
    private int views = 0;

    @Lob
    @Column(nullable = true)
    private String reporterProfile;
}
