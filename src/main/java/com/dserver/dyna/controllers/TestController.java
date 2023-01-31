package com.dserver.dyna.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.log4j.Log4j2;


@RestController
@Log4j2
public class TestController {

    @GetMapping("/test")
    public String test() {
        log.error("TestController.test() called");
        return "Hello World";
    }
}
