package com.arquivei.test.receivednfeviewer.web;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ReceivedNfeViewerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ReceivedNfeViewerApplication.class, args);
    }

}
