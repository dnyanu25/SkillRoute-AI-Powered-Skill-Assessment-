package com.skillroute.skillroute_backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillroute.skillroute_backend.dto.request.InterviewAnswerReq;
import com.skillroute.skillroute_backend.dto.request.InterviewStartReq;
import com.skillroute.skillroute_backend.dto.response.InterviewAnswerRes;
import com.skillroute.skillroute_backend.dto.response.InterviewResultRes;
import com.skillroute.skillroute_backend.dto.response.InterviewStartRes;
import com.skillroute.skillroute_backend.entity.Interview;
import com.skillroute.skillroute_backend.repository.InterviewRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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

    private static final String EVAL_SYSTEM_PROMPT =
            "You are a strict but fair technical interviewer evaluating candidate answers.\n" +
                    "Score honestly based on accuracy, depth, and clarity.\n" +
                    "Always respond with valid JSON only, no markdown formatting.";

    /* =============================================
       START INTERVIEW
       ============================================= */
    public InterviewStartRes startInterview(InterviewStartReq request) {
        try {
            String userPrompt = buildInterviewPrompt(
                    request.getSkill(),
                    request.getDifficulty(),
                    request.getQuestionCount()
            );

            String aiResponse = groqService.callAIWithModel(
                    SYSTEM_PROMPT,
                    userPrompt,
                    "llama-3.3-70b-versatile"
            );

            InterviewQuestionsDTO questionsDTO = groqService.extractJSON(
                    aiResponse,
                    InterviewQuestionsDTO.class
            );

            Interview interview = new Interview();
            interview.setSkill(request.getSkill());
            interview.setDifficulty(request.getDifficulty());
            interview.setQuestionCount(request.getQuestionCount());
            interview.setQuestionsJson(aiResponse);
            interview.setStatus("in_progress");

            interview = interviewRepo.save(interview);

            InterviewStartRes response = new InterviewStartRes();
            response.setInterviewId(interview.getId());
            response.setSkill(interview.getSkill());
            response.setDifficulty(interview.getDifficulty());
            response.setStatus(interview.getStatus());

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
       EVALUATE ANSWER
       ============================================= */
    public InterviewAnswerRes evaluateAnswer(InterviewAnswerReq request) {
        try {
            String userPrompt = String.format("""
                Skill: %s
                Question: %s
                Candidate's Answer: %s
                
                Evaluate this answer and return ONLY valid JSON:
                {
                  "score": <integer 0-10>,
                  "feedback": "<2-3 sentences: what was good, what was missing>",
                  "idealAnswer": "<what a strong answer would include in 3-4 sentences>"
                }
                
                Scoring guide:
                - 0-3: Incorrect or very incomplete
                - 4-6: Partially correct, missing key points
                - 7-8: Good answer with minor gaps
                - 9-10: Excellent, thorough answer
                """,
                    request.getSkill(), request.getQuestion(), request.getUserAnswer()
            );

            String aiResponse = groqService.callAIWithModel(
                    EVAL_SYSTEM_PROMPT,
                    userPrompt,
                    "llama-3.3-70b-versatile"
            );

            EvalDTO eval = groqService.extractJSON(aiResponse, EvalDTO.class);

            Interview interview = interviewRepo.findById(request.getInterviewId())
                    .orElseThrow(() -> new RuntimeException("Interview not found"));

            boolean isLast = request.getQuestionNumber() == interview.getQuestionCount();

            if (isLast) {
                interview.setStatus("completed");
                interview.setCompletedAt(LocalDateTime.now());
                interviewRepo.save(interview);
            }

            InterviewAnswerRes response = new InterviewAnswerRes();
            response.setQuestionNumber(request.getQuestionNumber());
            response.setScore(eval.getScore());
            response.setFeedback(eval.getFeedback());
            response.setIdealAnswer(eval.getIdealAnswer());
            response.setLast(isLast);

            return response;

        } catch (Exception e) {
            throw new RuntimeException("Error evaluating answer: " + e.getMessage());
        }
    }

    /* =============================================
       BUILD INTERVIEW PROMPT
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
  GET INTERVIEW RESULT
  Returns full summary after interview is done
  ============================================= */
    public InterviewResultRes getResult(Long interviewId) {
        try {
            Interview interview = interviewRepo.findById(interviewId)
                    .orElseThrow(() -> new RuntimeException("Interview not found"));

            InterviewResultRes response = new InterviewResultRes();
            response.setInterviewId(interview.getId());
            response.setSkill(interview.getSkill());
            response.setDifficulty(interview.getDifficulty());
            response.setStatus(interview.getStatus());
            response.setTotalScore(interview.getTotalScore());
            response.setOverallFeedback(interview.getOverallFeedback());
            response.setCreatedAt(interview.getCreatedAt());
            response.setCompletedAt(interview.getCompletedAt());

            return response;

        } catch (Exception e) {
            throw new RuntimeException("Error fetching result: " + e.getMessage());
        }
    }
    /* =============================================
       INTERNAL DTOs (only used inside this service)
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

    @lombok.Getter
    @lombok.Setter
    private static class EvalDTO {
        private int score;
        private String feedback;
        private String idealAnswer;
    }
}