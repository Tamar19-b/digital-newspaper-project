package myspring.demo.dal;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import myspring.demo.model.Section;


@Repository
public interface SectionRepository extends CrudRepository<Section,Integer>

{
    //
}