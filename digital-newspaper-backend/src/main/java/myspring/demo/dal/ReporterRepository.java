package myspring.demo.dal;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import myspring.demo.model.Reporter;

@Repository
public interface ReporterRepository extends CrudRepository<Reporter,Integer>

{
    Optional<Reporter> findByEmail(String email); 
}