package myspring.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.web.bind.annotation.*;
import myspring.demo.dto.ArticleCommentDTO;
// import myspring.demo.dto.ArticleDTO;
// import myspring.demo.model.Article;
import myspring.demo.model.ArticleComment;
import myspring.demo.service.ArticleCommentService;
// import myspring.demo.service.UserService;
// import myspring.demo.service.ArticleService;
// import myspring.demo.service.ArticleService;
// import myspring.demo.service.UserService;

import java.lang.reflect.Type;
// import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/comments")
public class ArticleCommentController {

    @Autowired
    private ArticleCommentService commentService;

    // @Autowired
    // private UserService userService;

    // @Autowired
    // private ArticleService articleService;

    @Autowired
    private ModelMapper mapper;

    // @PostMapping("/add")
    // public void addComment(@RequestBody ArticleCommentDTO dto) {
    // ArticleComment comment = new ArticleComment();
    // comment.setText(dto.getText());
    // comment.setArticle(articleService.getByCodeArticle(dto.getArticleId()));
    // comment.setUser(userService.getById(dto.getUserId()));
    // commentService.addComment(comment);
    // }


   

    @PostMapping("/add")
    public ResponseEntity<?> addComment(@RequestBody ArticleCommentDTO dto) {
    try {
    commentService.addComment(mapper.map(dto, ArticleComment.class));
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

    @GetMapping("/byArticle/{articleId}")
    public List<ArticleCommentDTO> getComments(@PathVariable int articleId) {
        Type t = new TypeToken<List<ArticleCommentDTO>>() {
        }.getType();
        return mapper.map(commentService.getCommentsForArticle(articleId), t);
    }
}
