package myspring.demo.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import myspring.demo.dal.UserRepository;

import myspring.demo.model.User;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepo;

    @Override
    public void registerUser(User user) {
        if (userRepo.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists: " + user.getEmail());
        }

        // יצירת טוקן רנדומלי בעת רישום
        user.setToken(UUID.randomUUID().toString());

        userRepo.save(user);
    }

    @Override
    public List<User> getAll() {
        return (List<User>) userRepo.findAll();
    }

    @Override
    public User getById(int id) {
        return userRepo.findById(id).orElse(null);
    }

        @Override
    public User getByEmailUser(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User with email " + email + " not found."));
    }


    @Override
    public void updateUser(User user) {
        if (!userRepo.existsById(user.getId())) {
            throw new RuntimeException("User with ID " + user.getId() + " does not exist.");
        }

        // אם אין טוקן קיים – צור חדש
        if (user.getToken() == null || user.getToken().isEmpty()) {
            user.setToken(UUID.randomUUID().toString());
        }

        userRepo.save(user);
    }
}
