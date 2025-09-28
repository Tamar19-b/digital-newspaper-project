//  package myspring.demo.config;

// import jakarta.annotation.PostConstruct;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.jdbc.core.JdbcTemplate;
// import org.springframework.stereotype.Component;

// @Component
// public class DbMigrationRunner {

//     @Autowired
//     private JdbcTemplate jdbcTemplate;

//     @PostConstruct
//     public void migrate() {

    
//         // 🆕 הוספת שדה reporter_profile
//         try {
//             jdbcTemplate.execute("ALTER TABLE article ADD COLUMN reporter_profile TEXT");
//         } catch (Exception e) {}
//     }
// }
