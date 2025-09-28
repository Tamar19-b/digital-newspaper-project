package myspring.demo.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.web.bind.annotation.*;
import myspring.demo.model.User;
import myspring.demo.dto.UserDTO;
import myspring.demo.service.UserService;
import java.lang.reflect.Type;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private ModelMapper mapper;

    @PostMapping("/register")
    public void register(@RequestBody UserDTO dto) {
        userService.registerUser(mapper.map(dto, User.class));
    }

    @GetMapping("/all")
    public List<UserDTO> getAll() {
        Type t = new TypeToken<List<UserDTO>>() {}.getType();
        return mapper.map(userService.getAll(), t);
    }

    @GetMapping("/getByEmail/{email}")
    public UserDTO getUserByEmail(@PathVariable String email) {
        User user = userService.getByEmailUser(email);
        return mapper.map(user, UserDTO.class);
    }

    @GetMapping("/{id}")
    public UserDTO getById(@PathVariable int id) {
        return mapper.map(userService.getById(id), UserDTO.class);
    }
    //update user
    @PutMapping("/update")
    public void update(@RequestBody UserDTO dto) {
        userService.updateUser(mapper.map(dto, User.class));
    }
}
