package com.skillroute.skillroute_backend.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
@Getter
public class Groq {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    @Value("${groq.api.model}")
    private String model;

    @Value("${groq.api.temperature}")
    private double temperature;

    @Value("${groq.api.max-tokens}")
    private int maxTokens;

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}