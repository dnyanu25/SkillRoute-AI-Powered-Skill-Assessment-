package com.skillroute.skillroute_backend.service;

import com.skillroute.skillroute_backend.dto.request.RoadmapReq;
import com.skillroute.skillroute_backend.dto.response.RoadmapRes;
import com.skillroute.skillroute_backend.entity.Roadmap;
import com.skillroute.skillroute_backend.repository.RoadmapRepo;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoadmapService {

    @Autowired
    private GroqService groqService;

    @Autowired
    private RoadmapRepo roadmapRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // ===================================
    // SYSTEM PROMPT
    // Mirrors: SYSTEM_PROMPTS.roadmapGenerator
    // ===================================

    private static final String SYSTEM_PROMPT =
            """
            
            You are an expert learning path designer with years of experience in curriculum development and educational technology.

            Your role is to create detailed, practical, and personalized learning roadmaps that:
            - Are tailored to the learner's current skill level
            - Include progressive, achievable goals
            - Focus on practical, real-world application
            - Balance theory with hands-on practice
            - Are motivating and engaging

            Always respond with valid JSON only, no markdown formatting or extra text.
            """;

    // ===================================
    // generateRoadmap()
    // Mirrors: generateRoadmap(userInfo) in aiService.js
    // ===================================
    public RoadmapRes generateRoadmap(RoadmapReq request) {
        try {
            /* Step 1: Build the prompt
             Mirrors: buildRoadmapPrompt(userInfo)*/
            String userPrompt = buildRoadmapPrompt(request);
            /* Step 2: Call Groq API
             Mirrors: callAI(SYSTEM_PROMPTS.roadmapGenerator, userPrompt)*/
            String aiResponse = groqService.callAI(SYSTEM_PROMPT, userPrompt);
            /* Step 3: Parse JSON response
            // Mirrors: extractJSON(response)*/
            RoadmapRes roadmapData = groqService.extractJSON(aiResponse, RoadmapRes.class);
            // Step 4: Save to database
            saveToDatabase(request, aiResponse);
            // Step 5: Return parsed roadmap to controller
            return roadmapData;
        } catch (Exception e) {
            throw new RuntimeException("Error generating roadmap: " + e.getMessage());
        }
    }
    /* ===================================
    // buildRoadmapPrompt()
    // Mirrors: buildRoadmapPrompt() in promptBuilder.js
    // Exact same prompt text!
    // ===================================*/
    private String buildRoadmapPrompt(RoadmapReq req) {

        // Build requirements list
        // Mirrors: const requirements = []
        StringBuilder requirements = new StringBuilder();
        if (req.isIncludePractice()) {
            requirements.append("\n- Include practice questions for each topic");
        }
        if (req.isIncludeProjects()) {
            requirements.append("\n- Include mini projects to apply learned concepts");
        }
        if (req.isIncludeRevision()) {
            requirements.append("\n- Include revision periods to reinforce learning");
        }

        // Build goals text
        // Mirrors: const goalsText = goals ? `\nSpecific Goals: ${goals}` : ''
        String goalsText = (req.getGoals() != null && !req.getGoals().isEmpty())
                ? "\nSpecific Goals: " + req.getGoals()
                : "";

        // Build final prompt
        // Mirrors the exact template literal from promptBuilder.js
        return String.format("""
                Create a comprehensive learning roadmap for %s at %s level.

                Duration: %d %s%s%s

                Create a structured plan in JSON format with this exact structure:
                {
                  "skill": "%s",
                  "level": "%s",
                  "planDuration": %d,
                  "planType": "%s",
                  "weeks": [
                    {
                      "week": 1,
                      "title": "Descriptive week title",
                      "completed": false,
                      "tasks": [
                        {"id": 1, "task": "Specific, actionable task description", "completed": false},
                        {"id": 2, "task": "Another task", "completed": false}
                      ]
                    }
                  ]
                }

                Important:
                - Make tasks practical, specific, and actionable
                - Tailor difficulty to %s level
                - Each week should have 3-5 tasks
                - Tasks should build upon previous weeks
                - Include hands-on learning activities
                - Return ONLY valid JSON, no markdown formatting""",
                req.getSkill(),       // %s - skill name
                req.getLevel(),       // %s - level
                req.getDuration(),    // %d - duration number
                req.getDurationType(), // %s - weeks/months
                requirements,         // %s - requirements list
                goalsText,            // %s - goals
                req.getSkill(),       // %s - skill in JSON template
                req.getLevel(),       // %s - level in JSON template
                req.getDuration(),    // %d - planDuration in JSON template
                req.getDurationType(), // %s - planType in JSON template
                req.getLevel()        // %s - level in Important section
        );
    }
    // ===================================
    // Save to Database
    // ===================================
    private void saveToDatabase(RoadmapReq request, String aiResponse) {
        Roadmap roadmap = new Roadmap();
        roadmap.setSkill(request.getSkill());
        roadmap.setLevel(request.getLevel());
        roadmap.setDuration(request.getDuration());
        roadmap.setDurationType(request.getDurationType());
        roadmap.setIncludePractice(request.isIncludePractice());
        roadmap.setIncludeProjects(request.isIncludeProjects());
        roadmap.setIncludeRevision(request.isIncludeRevision());
        roadmap.setGoals(request.getGoals());
        roadmap.setAiResponse(aiResponse);
        roadmapRepository.save(roadmap);
    }
    /* Get all roadmaps from database */
    public List<Roadmap> getAllRoadmaps() {
        return roadmapRepository.findAll();
    }
    /* Get roadmap by ID from database */
    public RoadmapRes getRoadmapById(Long id) {
        Roadmap roadmap = roadmapRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Roadmap not found with id: " + id));
        try {
            return objectMapper.readValue(roadmap.getAiResponse(), RoadmapRes.class);
        } catch (Exception e) {
            throw new RuntimeException("Error parsing roadmap: " + e.getMessage());
        }
    }
}