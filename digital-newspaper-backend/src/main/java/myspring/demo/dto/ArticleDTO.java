package myspring.demo.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class ArticleDTO {
    private int idArticle;
    private String type;
    private String subType;
    private String title;
    private String imge;
    private String text;
    private boolean reporterApproval;
    private boolean editorApproval;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime lastModified;
    private LocalDateTime publishedAt;
    private int sectionId;
    private String sectionName;
    private Integer editorId;
    private String editorName;
    private int reporterId;
    private String reporterName;
    private String editorNotes;

    // 🆕 שדות חדשים
    private int likeCount;
    private int dislikeCount;
    private int views;

    
    // 🆕 שדה חדש – פרופיל הכתב
    private String reporterProfile;
}
