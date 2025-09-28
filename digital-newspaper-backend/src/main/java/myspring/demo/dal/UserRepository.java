package myspring.demo.dal;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import myspring.demo.model.User;


@Repository
public interface UserRepository extends CrudRepository<User, Integer> {
    boolean existsByEmail(String email);
   // User findByEmail(String email);
     Optional<User> findByEmail(String email);
}
