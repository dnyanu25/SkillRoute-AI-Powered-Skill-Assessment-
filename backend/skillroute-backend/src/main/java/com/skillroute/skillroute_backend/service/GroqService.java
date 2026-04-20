package com.skillroute.skillroute_backend.service;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillroute.skillroute_backend.config.Groq;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class GroqService {

    @Autowired
    private Groq groqConfig;

    @Autowired
    private RestTemplate restTemplate;

    // Jackson JSON parser — equivalent to JSON.parse() in JS
    private final ObjectMapper objectMapper = new ObjectMapper();

    // ===================================
    // callAI() — mirrors your JS function
    // ===================================
    /**
     * Generic function to call Groq API
     * Equivalent to callAI() in aiService.js
     */
    public String callAI(String systemPrompt, String userPrompt) {
        try {
            // Build request headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(groqConfig.getApiKey()); // Authorization: Bearer <key>

            // Build request body
            // Mirrors: groq.chat.completions.create({messages, model, temperature, max_tokens})
            Map<String, Object> requestBody = Map.of(
                    "model", groqConfig.getModel(),
                    "temperature", groqConfig.getTemperature(),
                    "max_tokens", groqConfig.getMaxTokens(),
                    "messages", List.of(
                            Map.of("role", "system", "content", systemPrompt),
                            Map.of("role", "user", "content", userPrompt)
                    )
            );

            // Combine headers + body into one HTTP entity
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // Make the POST request to Groq API
            ResponseEntity<String> response = restTemplate.exchange(
                    groqConfig.getApiUrl(),
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            // Parse the response and extract the message content
            // Mirrors: completion.choices[0]?.message?.content || ""
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode content = root
                    .path("choices")
                    .get(0)
                    .path("message")
                    .path("content");

            return content.asText("");

        } catch (Exception e) {
            throw new RuntimeException("Failed to get response from AI. Please try again. " + e.getMessage());
        }
    }

    // ===================================
    // extractJSON() — mirrors your JS function
    // ===================================
    /**
     * Extracts and parses JSON from AI response string
     * Equivalent to extractJSON() in aiService.js
     */
    public <T> T extractJSON(String response, Class<T> targetClass) {
        try {
            // Try to find JSON object in response
            // Mirrors: response.match(/\{[\s\S]*\}/)
            Pattern pattern = Pattern.compile("\\{[\\s\\S]*\\}");
            Matcher matcher = pattern.matcher(response);

            if (!matcher.find()) {
                throw new RuntimeException("Invalid response format from AI");
            }

            String jsonString = matcher.group();

            // Parse JSON into target DTO class
            // Mirrors: JSON.parse(jsonMatch[0])
            return objectMapper.readValue(jsonString, targetClass);

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse AI response as JSON: " + e.getMessage());
        }
    }

    /* Call AI with specific model (for interviews) */
    public String callAIWithModel(String systemPrompt, String userPrompt, String model) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(groqConfig.getApiKey());

            Map<String, Object> requestBody = Map.of(
                    "model", model,  // Use the specified model instead of default
                    "temperature", 0.7,
                    "max_tokens", 3000,  // More tokens for interview questions
                    "messages", List.of(
                            Map.of("role", "system", "content", systemPrompt),
                            Map.of("role", "user", "content", userPrompt)
                    )
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    groqConfig.getApiUrl(),
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            JsonNode root = objectMapper.readTree(response.getBody());
            return root.path("choices").get(0).path("message").path("content").asText("");

        } catch (Exception e) {
            throw new RuntimeException("Failed to get response from AI: " + e.getMessage());
        }
    }
}