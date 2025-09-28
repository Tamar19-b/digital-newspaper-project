package myspring.demo;

import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	//ידוע ליצור אובייקט מתאים שיוחזק אצלו ויוזרק בהתאם לצורך //IoC //באופן זה ה
	@Bean
	public ModelMapper getMapper()
	{
		return new ModelMapper();
	}

}
