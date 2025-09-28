package myspring.demo.controller;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import myspring.demo.dto.ArticleDTO;
import myspring.demo.model.Article;
import myspring.demo.model.ArticleStatus;
import myspring.demo.service.ArticleService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.lang.reflect.Type;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/Articles") // דרך הכתובת הזו תהיה הגישה לכל הפונקציות במחלקה
public class ArticleController {
    // יודע להזריק את המופע המתאים לכאן //IoC //באופן זה
    @Autowired
    private ArticleService aService;
    @Autowired
    private ModelMapper mapper;// לצורך המרות אובייקטים

    @GetMapping("/getAll")
    public List<ArticleDTO> getAllArticles() {
        Type t = new TypeToken<List<ArticleDTO>>() {
        }.getType();// באופן זה מוגדר הסוג הנכון אליו תתבצע ההמרה של רשימה שלימה
        return mapper.map(aService.getAll(), t);
    }

    //  @GetMapping("/getByReporterID/{id}")
    // public List<ArticleDTO> getByReporterID() {
    //     Type t = new TypeToken<List<ArticleDTO>>() {
    //     }.getType();// באופן זה מוגדר הסוג הנכון אליו תתבצע ההמרה של רשימה שלימה
    //     return mapper.map(aService.getAll(), t);
    // }

    @PostMapping("/add")
    public ResponseEntity<?> addArticle(@RequestBody ArticleDTO p) {
        try {
            aService.addArticle(mapper.map(p, Article.class));
            return ResponseEntity.ok().build(); // הצלחה ללא גוף
        } catch (Exception e) {
            // הדפסת השגיאה המלאה ללוג
            e.printStackTrace();

            // החזרת תגובה עם קוד 500 ותיאור השגיאה
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("שגיאה בעת הוספת כתבה: " + e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public void updateArticle(@PathVariable int id, @RequestBody ArticleDTO p) {
        p.setIdArticle(id); // לקבוע את ה-ID מה-URL
        aService.updateArticle(mapper.map(p, Article.class));
    }

    // @PutMapping("/update/{id}")
    // public ResponseEntity<?> updateArticle(@PathVariable int id, @RequestBody
    // ArticleDTO dto) {
    // try {
    // // שליפת הכתבה הקיימת מה־DB
    // Article existing = aService.getByCodeArticle(id);

    // if (existing == null) {
    // return ResponseEntity.status(HttpStatus.NOT_FOUND).body("כתבה לא נמצאה");
    // }

    // // עדכון שדות רלוונטיים בלבד
    // if (dto.getStatus() != null) {
    // existing.setStatus(ArticleStatus.valueOf(dto.getStatus()));
    // }

    // if (dto.getEditorNotes() != null) {
    // existing.setEditorNotes(dto.getEditorNotes());
    // }

    // existing.setLastModified(java.time.LocalDateTime.now());

    // // שמירה
    // aService.updateArticle(existing);

    // return ResponseEntity.ok("הכתבה עודכנה בהצלחה");

    // } catch (Exception e) {
    // e.printStackTrace();
    // return ResponseEntity.status(500).body("שגיאה בשרת: " + e.getMessage());
    // }
    // }

    @DeleteMapping("/delete/{idArticle}") // מקבל את הפרמטר מהכתובת
    public void deleteArticle(@PathVariable int idArticle) {
        aService.deleteArticle(idArticle);
    }

    @GetMapping("/getByCode/{idArticle}")
    public Article getArticle(@PathVariable int idArticle) {
        return aService.getByCodeArticle(idArticle);
    }

    // @GetMapping("/getBySection/{sectionId}")
    // public List<ArticleDTO> getBySection(@PathVariable int sectionId) {
    // Type t = new TypeToken<List<ArticleDTO>>() {
    // }.getType();
    // return mapper.map(aService.getBySection(sectionId), t);
    // }

    @GetMapping("/getByStatus/{status}")
    public List<ArticleDTO> getByStatus(@PathVariable String status) {
        Type t = new TypeToken<List<ArticleDTO>>() {
        }.getType();
        return mapper.map(aService.getByStatus(ArticleStatus.valueOf(status)), t);
    }

    // @GetMapping("/getBySectionAndStatus")
    // public List<ArticleDTO> getBySectionAndStatus(@RequestParam int sectionId,
    // @RequestParam String status) {
    // Type t = new TypeToken<List<ArticleDTO>>() {
    // }.getType();
    // return mapper.map(aService.getBySectionAndStatus(sectionId,
    // ArticleStatus.valueOf(status)), t);
    // }
    @GetMapping("/getBySectionAndStatus")
    public List<ArticleDTO> getBySectionAndStatus(@RequestParam int sectionId, @RequestParam String status) {
        try {
            ArticleStatus statusEnum = ArticleStatus.valueOf(status.trim().toUpperCase());
            Type t = new TypeToken<List<ArticleDTO>>() {
            }.getType();
            return mapper.map(aService.getBySectionAndStatus(sectionId, statusEnum), t);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid article status: " + status);
        }
    }

    // 🆕 endpoints חדשים
    @PutMapping("/like/{id}")
    public ResponseEntity<?> likeArticle(@PathVariable int id) {
        aService.incrementLike(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/unlike/{id}")
    public ResponseEntity<?> unlikeArticle(@PathVariable int id) {
        aService.decrementLike(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/dislike/{id}")
    public ResponseEntity<?> dislikeArticle(@PathVariable int id) {
        aService.incrementDislike(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/undislike/{id}")
    public ResponseEntity<?> undislikeArticle(@PathVariable int id) {
        aService.decrementDislike(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/view/{id}")
    public ResponseEntity<?> viewArticle(@PathVariable int id) {
        aService.incrementViews(id);
        return ResponseEntity.ok().build();
    }
    

}
