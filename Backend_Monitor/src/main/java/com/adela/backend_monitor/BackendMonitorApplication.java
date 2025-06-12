package com.adela.backend_monitor;

import de.codecentric.boot.admin.server.config.EnableAdminServer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableAdminServer
public class BackendMonitorApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendMonitorApplication.class, args);
    }

}
