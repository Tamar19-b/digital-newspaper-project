package myspring.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import myspring.demo.dal.EditorRepository;
import myspring.demo.model.Editor;

@Service
public class EditorServiceImpl implements EditorService{

    @Autowired
    private EditorRepository rep;

    @Override
    public void addEditor(Editor a) {
        if(rep.existsById(a.getIdEditor()))
            throw new RuntimeException("Cannot add Editor with the code "+a.getIdEditor()+" because it already exists.");
        rep.save(a);
    }

    @Override
    public void updateEditor(Editor a) {
        if(!rep.existsById(a.getIdEditor()))
            throw new RuntimeException("Cannot update Editor with the code "+a.getIdEditor()+" because it does not exist.");
        rep.save(a);
    }

    @Override
    public void deleteEditor(int idEditor) {
        rep.deleteById(idEditor);
    }

    @Override
    public List<Editor> getAll() {
        return (List<Editor>)rep.findAll();
    }

    @Override
    public Editor getByCodeEditor(int idEditor) {       
        return rep.findById(idEditor).get();
    }
   @Override
    public Editor getByEmailEditor(String email) {
        return rep.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Editor with email " + email + " not found."));
    }

}
