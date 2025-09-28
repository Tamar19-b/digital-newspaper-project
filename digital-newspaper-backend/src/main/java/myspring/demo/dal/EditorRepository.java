package myspring.demo.dal;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import myspring.demo.model.Editor;

@Repository
public interface EditorRepository extends CrudRepository<Editor,Integer>

{
     Optional<Editor> findByEmail(String email); 
}