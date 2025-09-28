package myspring.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import myspring.demo.dal.SectionRepository;
import myspring.demo.model.Section;
@Service
public class SectionServiceImpl implements SectionService {
    //יודע להזריק את המופע המתאים לכאן //IoC //באופן זה 
    @Autowired
    private SectionRepository rep;

    @Override
    public void addSection(Section a) {
        if(rep.existsById(a.getIdSection()))
            throw new RuntimeException("Cannot add Section with the code "+a.getIdSection()+" because it already exists.");
        rep.save(a);
    }

    @Override
    public void updateSection(Section a) {
        if(!rep.existsById(a.getIdSection()))
            throw new RuntimeException("Cannot update Section with the code "+a.getIdSection()+" because it does not exist.");
        rep.save(a);
    }

    @Override
    public void deleteSection(int idSection) {
        rep.deleteById(idSection);
    }

    @Override
    public List<Section> getAll() {
        return (List<Section>)rep.findAll();
    }

    @Override
    public Section getByCodeSection(int idSection) {       
        return rep.findById(idSection).get();
    }

}
