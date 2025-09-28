package myspring.demo.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import myspring.demo.model.Reporter;

public interface ReporterService {
    void addReporter(Reporter a);

    void updateReporter(Reporter a);

    void deleteReporter(int idReporter);

    List<Reporter> getAll();

    Reporter getByCodeReporter(int idReporter);

    Reporter getByEmailReporter(String email);

    void saveProfileImage(int reporterId, MultipartFile file);
}
