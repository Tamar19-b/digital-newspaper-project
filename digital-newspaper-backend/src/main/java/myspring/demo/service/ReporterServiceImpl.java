package myspring.demo.service;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import myspring.demo.dal.ReporterRepository;
import myspring.demo.model.Reporter;

@Service
public class ReporterServiceImpl implements ReporterService {

    @Autowired
    private ReporterRepository rep;

    private final String uploadDir = "D:/demo/uploads/images/";

    @Override
    public void addReporter(Reporter a) {
        if (rep.existsById(a.getIdReporter()))
            throw new RuntimeException(
                    "Cannot add Reporter with the code " + a.getIdReporter() + " because it already exists.");
        rep.save(a);
    }

    @Override
    public void updateReporter(Reporter a) {
        if (!rep.existsById(a.getIdReporter()))
            throw new RuntimeException(
                    "Cannot update Reporter with the code " + a.getIdReporter() + " because it does not exist.");
        rep.save(a);
    }

    @Override
    public void deleteReporter(int idReporter) {
        rep.deleteById(idReporter);
    }

    @Override
    public List<Reporter> getAll() {
        return (List<Reporter>) rep.findAll();
    }

    @Override
    public Reporter getByCodeReporter(int idReporter) {
        return rep.findById(idReporter).orElseThrow(() -> new RuntimeException("Reporter not found"));
    }

    @Override
    public Reporter getByEmailReporter(String email) {
        return rep.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Reporter with email " + email + " not found."));
    }

    @Override
    public void saveProfileImage(int reporterId, MultipartFile file) {
        System.out.println("▶ נכנסתי לפונקציה של שמירת תמונה");
        Reporter reporter = rep.findById(reporterId)
                .orElseThrow(() -> new RuntimeException(" Reporter not found (id = " + reporterId + ")"));

        try {
            Files.createDirectories(Paths.get(uploadDir));
            String fileName = reporterId + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir + fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            System.out.println(" נשמר קובץ: " + filePath);

            reporter.setProfileImageName(fileName);
            rep.save(reporter);

            System.out.println(" שמרתי את השם למסד נתונים");
        } catch (IOException e) {
            System.out.println(" תקלה בשמירת הקובץ: " + e.getMessage());
            throw new RuntimeException("Failed to save image", e);
        }
    }

}
