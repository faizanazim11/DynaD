package com.dserver.dyna;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.dserver.dyna.listeners.LoggingLIstener;

@SpringBootApplication
public class DynaApplication {

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(DynaApplication.class);
		app.addListeners(new LoggingLIstener());
		app.run(args);
	}

}
