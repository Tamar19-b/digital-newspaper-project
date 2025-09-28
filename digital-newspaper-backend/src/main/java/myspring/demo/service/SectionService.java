package myspring.demo.service;
import java.util.List;
import myspring.demo.model.Section;

public interface SectionService {
   void addSection(Section s);
    void updateSection(Section s);
    void deleteSection(int idSection);
    List<Section> getAll();
    Section getByCodeSection(int idSection);
}
