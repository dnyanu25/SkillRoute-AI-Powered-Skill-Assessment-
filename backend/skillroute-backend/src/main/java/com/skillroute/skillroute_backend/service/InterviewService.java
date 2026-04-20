package com.skillroute.skillroute_backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillroute.skillroute_backend.dto.request.InterviewStartReq;
import com.skillroute.skillroute_backend.dto.response.InterviewStartRes;
import com.skillroute.skillroute_backend.entity.Interview;
import com.skillroute.skillroute_backend.repository.InterviewRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InterviewService {

    @Autowired
    private GroqService groqService;

    @Autowired
    private InterviewRepo interviewRepo;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /* System prompt for interview question generation */
    private static final String SYSTEM_PROMPT =
            "You are an expert technical interviewer conducting professional interviews.\n" +
                    "Generate realistic, practical interview questions that test both theoretical knowledge and real-world application.\n" +
                    "Questions should be clear, professional, and appropriate for the specified difficulty level.\n" +
                    "Always respond with valid JSON only, no markdown formatting.";

    /* =============================================
       START INTERVIEW
       Generates questions and creates interview session
       ============================================= */
    public InterviewStartRes startInterview(InterviewStartReq request) {
        try {
            /* Step 1: Build the prompt for Groq */
            String userPrompt = buildInterviewPrompt(
                    request.getSkill(),
                    request.getDifficulty(),
                    request.getQuestionCount()
            );

            /* Step 2: Call Groq API with llama-3.3-70b-versatile model */
            String aiResponse = groqService.callAIWithModel(
                    SYSTEM_PROMPT,
                    userPrompt,
                    "llama-3.3-70b-versatile"  // Better model for interviews
            );

            /* Step 3: Parse the JSON response from Groq */
            InterviewQuestionsDTO questionsDTO = groqService.extractJSON(
                    aiResponse,
                    InterviewQuestionsDTO.class
            );

            /* Step 4: Save to database */
            Interview interview = new Interview();
            interview.setSkill(request.getSkill());
            interview.setDifficulty(request.getDifficulty());
            interview.setQuestionCount(request.getQuestionCount());
            interview.setQuestionsJson(aiResponse);  // Store raw JSON
            interview.setStatus("in_progress");

            interview = interviewRepo.save(interview);

            /* Step 5: Build response for React */
            InterviewStartRes response = new InterviewStartRes();
            response.setInterviewId(interview.getId());
            response.setSkill(interview.getSkill());
            response.setDifficulty(interview.getDifficulty());
            response.setStatus(interview.getStatus());

            /* Convert questions to DTO format */
            List<InterviewStartRes.QuestionDTO> questions = questionsDTO.getQuestions()
                    .stream()
                    .map(q -> {
                        InterviewStartRes.QuestionDTO dto = new InterviewStartRes.QuestionDTO();
                        dto.setQuestionNumber(q.getQuestionNumber());
                        dto.setQuestion(q.getQuestion());
                        return dto;
                    })
                    .collect(Collectors.toList());

            response.setQuestions(questions);

            return response;

        } catch (Exception e) {
            throw new RuntimeException("Error starting interview: " + e.getMessage());
        }
    }

    /* =============================================
       BUILD INTERVIEW PROMPT
       Creates the prompt sent to Groq API
       ============================================= */
    private String buildInterviewPrompt(String skill, int difficulty, int questionCount) {
        return String.format("""
            Generate %d professional technical interview questions for %s at difficulty level %d/5.
            
            Difficulty guidelines:
            - Level 1-2: Basic concepts and terminology
            - Level 3: Practical application and problem-solving
            - Level 4-5: Advanced concepts, architecture, and optimization
            
            Return ONLY valid JSON in this exact format:
            {
              "skill": "%s",
              "difficulty": %d,
              "questions": [
                {
                  "questionNumber": 1,
                  "question": "Your question here?"
                },
                {
                  "questionNumber": 2,
                  "question": "Another question?"
                }
              ]
            }
            
            Requirements:
            - Questions should be open-ended, not multiple choice
            - Focus on practical understanding, not memorization
            - Each question should allow for detailed explanation
            - Questions should build in complexity
            - Return ONLY valid JSON, no extra text
            """,
                questionCount, skill, difficulty, skill, difficulty
        );
    }

    /* =============================================
       INTERNAL DTO for parsing Groq response
       ============================================= */
    @lombok.Getter
    @lombok.Setter
    private static class InterviewQuestionsDTO {
        private String skill;
        private int difficulty;
        private List<QuestionItem> questions;

        @lombok.Getter
        @lombok.Setter
        public static class QuestionItem {
            private int questionNumber;
            private String question;
        }
    }
}