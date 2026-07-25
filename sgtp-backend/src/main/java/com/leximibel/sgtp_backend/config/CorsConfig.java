package com.leximibel.sgtp_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        WebMvcConfigurer.super.addCorsMappings(registry);
        registry.addMapping("/**")
                .allowedOrigins("localhost:5173") // url do front
                .allowedMethods("GET", "POST", "PUT", "PUT", "PATCH", "DELETE", "OPTIONS") // Http Methods
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
