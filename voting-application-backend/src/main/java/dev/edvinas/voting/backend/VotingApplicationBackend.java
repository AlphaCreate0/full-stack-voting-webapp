package dev.edvinas.voting.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import java.util.List;

@SpringBootApplication
public class VotingApplicationBackend {

	public static void main(String[] args) {
		SpringApplication.run(VotingApplicationBackend.class, args);
	}

}
