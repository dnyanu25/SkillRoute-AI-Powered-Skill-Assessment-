package com.skillroute.skillroute_backend.service;

import com.skillroute.skillroute_backend.dto.request.RoadmapReq;
import com.skillroute.skillroute_backend.dto.request.UpdateRoadmapReq;
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

    /* generateRoadmap() */
    public RoadmapRes generateRoadmap(RoadmapReq request) {
        try {
            /* Step 1: Build prompt */
            String userPrompt = buildRoadmapPrompt(request);

            /* Step 2: Call Groq API */
            String aiResponse = groqService.callAI(SYSTEM_PROMPT, userPrompt);

            /* Step 3: Parse JSON response */
            RoadmapRes roadmapData = groqService.extractJSON(aiResponse, RoadmapRes.class);

            /* Step 4: Save to database and get saved entity */
            Roadmap saved = saveToDatabase(request, aiResponse);

            /* Step 5: Set roadmapId so frontend can send progress updates */
            roadmapData.setRoadmapId(saved.getId());

            /* Step 6: Return parsed roadmap to controller */
            return roadmapData;

        } catch (Exception e) {
            throw new RuntimeException("Error generating roadmap: " + e.getMessage());
        }
    }

    /* buildRoadmapPrompt() */
    private String buildRoadmapPrompt(RoadmapReq req) {
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

        String goalsText = (req.getGoals() != null && !req.getGoals().isEmpty())
                ? "\nSpecific Goals: " + req.getGoals()
                : "";

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
                req.getSkill(),
                req.getLevel(),
                req.getDuration(),
                req.getDurationType(),
                requirements,
                goalsText,
                req.getSkill(),
                req.getLevel(),
                req.getDuration(),
                req.getDurationType(),
                req.getLevel()
        );
    }

    /* Save to database — returns saved entity so we can get its id */
    private Roadmap saveToDatabase(RoadmapReq request, String aiResponse) {
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
        roadmap.setUserId(request.getUserId()); // ← link to logged in user
        return roadmapRepository.save(roadmap); // ← return saved entity
    }

    /* Update roadmap task completion progress */
    public void updateProgress(UpdateRoadmapReq request) {
        Roadmap roadmap = roadmapRepository.findById(request.getRoadmapId())
                .orElseThrow(() -> new RuntimeException("Roadmap not found"));
        roadmap.setCompletedTasks(request.getCompletedTasks());
        roadmap.setTotalTasks(request.getTotalTasks());
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