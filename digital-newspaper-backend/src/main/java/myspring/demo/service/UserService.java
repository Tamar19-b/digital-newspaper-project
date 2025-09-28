package myspring.demo.service;

import java.util.List;


import myspring.demo.model.User;

public interface UserService {
    void registerUser(User user);
    List<User> getAll();
    User getById(int id);
    void updateUser(User user);
 User getByEmailUser(String email) ;
}
