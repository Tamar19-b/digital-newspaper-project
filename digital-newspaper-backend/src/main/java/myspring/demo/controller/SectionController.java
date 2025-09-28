package myspring.demo.controller;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import myspring.demo.dto.SectionDTO;
import myspring.demo.model.Section;
import myspring.demo.service.SectionService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.lang.reflect.Type;


@RestController
@RequestMapping("/Sections") //דרך הכתובת הזו תהיה הגישה לכל הפונקציות במחלקה
public class SectionController {
    //יודע להזריק את המופע המתאים לכאן //IoC //באופן זה
    @Autowired
    private SectionService sService;
    @Autowired
    private ModelMapper mapper;//לצורך המרות אובייקטים

    @GetMapping("/getAll")
    public List<SectionDTO> getAllSections(){
        Type t=new TypeToken<List<SectionDTO>>(){}.getType();//באופן זה מוגדר הסוג הנכון אליו תתבצע ההמרה של רשימה שלימה
        return mapper.map(sService.getAll(),t);
    }

    @PostMapping("/add")
    public void addSection(@RequestBody SectionDTO p)
    {
        sService.addSection(mapper.map(p, Section.class));
    }

    @PutMapping("/update")
    public void updateSection(@RequestBody SectionDTO p)
    {
        sService.updateSection(mapper.map(p, Section.class));
    }

    @DeleteMapping("/delete/{idSection}")//מקבל את הפרמטר מהכתובת
    public void deleteSection(@PathVariable int idSection)
    {
            sService.deleteSection(idSection);
    }

    @GetMapping("/getByCode/{idSection}")
    public Section getSection(@PathVariable int idSection)
    {
        return sService.getByCodeSection(idSection);
    }



    
    
}
