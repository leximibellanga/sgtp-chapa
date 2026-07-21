package com.leximibel.sgtp_backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("teste")
public class Controller {

    @GetMapping
    public String teste() {
        return "teste Leximibel";
    }

}
