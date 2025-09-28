package myspring.demo.controller;

import java.lang.reflect.Type;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import myspring.demo.dto.ReporterDTO;
import myspring.demo.model.Reporter;
import myspring.demo.service.ReporterService;

@RestController
@RequestMapping("/Reporters")
public class ReporterController {

    @Autowired
    private ReporterService rService;

    @Autowired
    private ModelMapper mapper;

    @GetMapping("/getAll")
    public List<ReporterDTO> getAllReporters() {
        Type t = new TypeToken<List<ReporterDTO>>() {}.getType();
        return mapper.map(rService.getAll(), t);
    }

    @PostMapping("/add")
    public void addReporter(@RequestBody ReporterDTO p) {
        rService.addReporter(mapper.map(p, Reporter.class));
    }

    @PutMapping("/update")
    public void updateReporter(@RequestBody ReporterDTO p) {
        rService.updateReporter(mapper.map(p, Reporter.class));
    }

    @DeleteMapping("/delete/{idReporter}")
    public void deleteReporter(@PathVariable int idReporter) {
        rService.deleteReporter(idReporter);
    }

    @GetMapping("/getByCode/{idReporter}")
    public ReporterDTO getReporter(@PathVariable int idReporter) {
        Reporter reporter = rService.getByCodeReporter(idReporter);
        return mapper.map(reporter, ReporterDTO.class);
    }

    @GetMapping("/getByEmail/{email}")
    public ReporterDTO getReporterByEmail(@PathVariable String email) {
        Reporter reporter = rService.getByEmailReporter(email);
        return mapper.map(reporter, ReporterDTO.class);
    }

    // ✅ נקודת קצה חדשה: העלאת תמונה
    @PostMapping("/uploadProfileImage/{id}")
    public void uploadProfileImage(@PathVariable int id, @RequestParam("file") MultipartFile file) {
        rService.saveProfileImage(id, file);
    }
}
