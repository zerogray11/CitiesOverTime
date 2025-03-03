package com.media.CitiesOverTimeJava;

import org.junit.jupiter.api.Test;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class CitiesOverTimeApplicationTests {

	@Test
	void contextLoads() {
	}
	@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
	public class CitiesOverTimeApplication {
		public static void main(String[] args) {
			SpringApplication.run(CitiesOverTimeApplication.class, args);
		}
	}

}
