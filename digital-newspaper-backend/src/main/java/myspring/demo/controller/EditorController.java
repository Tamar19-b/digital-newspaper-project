package myspring.demo.controller;
import java.util.List;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import myspring.demo.dto.EditorDTO;
import myspring.demo.model.Editor;
import myspring.demo.service.EditorService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.lang.reflect.Type;

@RestController
@RequestMapping("/Editors")
public class EditorController {
    @Autowired
    private EditorService eService;
    @Autowired
    private ModelMapper mapper;

    @GetMapping("/getAll")
    public List<EditorDTO> getAllEditors() {
        Type t = new TypeToken<List<EditorDTO>>() {
        }.getType();
        return mapper.map(eService.getAll(), t);
    }

    @PostMapping("/add")
    public void addEditor(@RequestBody EditorDTO p) {
        eService.addEditor(mapper.map(p, Editor.class));
    }

    @PutMapping("/update")
    public void updateEditor(@RequestBody EditorDTO p) {
        eService.updateEditor(mapper.map(p, Editor.class));
    }

    @DeleteMapping("/delete/{idEditor}") // מקבל את הפרמטר מהכתובת
    public void deleteEditor(@PathVariable int idEditor) {
        eService.deleteEditor(idEditor);
    }

    @GetMapping("/getByCode/{idEditor}")
    public Editor getEditor(@PathVariable int idEditor) {
        return eService.getByCodeEditor(idEditor);
    }

    @GetMapping("/getByEmail/{email}")
    public EditorDTO getEditorByEmail(@PathVariable String email) {
        System.out.println("EMAIL RECEIVED: " + email);
        Editor editor = eService.getByEmailEditor(email); // מניח שזו המתודה בשירות
        System.out.println("EMAIL RECEIVED: " + mapper.map(editor, EditorDTO.class));
        return mapper.map(editor, EditorDTO.class);
    }

}
