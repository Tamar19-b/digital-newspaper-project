package myspring.demo.service;

import java.util.List;

import myspring.demo.model.Editor;


public interface EditorService {
    void addEditor(Editor e);
    void updateEditor(Editor e);
    void deleteEditor(int idEditor);
    List<Editor> getAll();
    Editor getByCodeEditor(int idEditor);
     Editor getByEmailEditor(String email);
}
