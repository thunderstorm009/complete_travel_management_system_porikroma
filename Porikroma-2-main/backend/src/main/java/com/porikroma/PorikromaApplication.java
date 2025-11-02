package com.porikroma;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
public class PorikromaApplication {

    public static void main(String[] args) {
        SpringApplication.run(PorikromaApplication.class, args);
    }
}