package myspring.demo.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.web.bind.annotation.*;
import myspring.demo.dto.ArticleCommentDTO;
import myspring.demo.model.ArticleComment;
import myspring.demo.service.ArticleCommentService;
import java.lang.reflect.Type;
import java.util.List;

@RestController
@RequestMapping("/comments")
public class ArticleCommentController {

    @Autowired
    private ArticleCommentService commentService;
    @Autowired
    private ModelMapper mapper;
    @PostMapping("/add")
    public ResponseEntity<?> addComment(@RequestBody ArticleCommentDTO dto) {
    try {
    commentService.addComment(mapper.map(dto, ArticleComment.class));
    return ResponseEntity.ok().build(); 
    } catch (Exception e) {
    e.printStackTrace();
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
