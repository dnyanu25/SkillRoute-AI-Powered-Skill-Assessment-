package com.skillroute.skillroute_backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillroute.skillroute_backend.dto.request.EvaluateRequest;
import com.skillroute.skillroute_backend.dto.request.QuizRequest;
import com.skillroute.skillroute_backend.dto.response.EvaluateResponse;
import com.skillroute.skillroute_backend.dto.response.QuizResponse;
import com.skillroute.skillroute_backend.entity.Quiz;
import com.skillroute.skillroute_backend.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class QuizService {

    @Autowired
    private GroqService groqService;

    @Autowired
    private QuizRepository quizRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /* System prompt - mirrors SYSTEM_PROMPTS.quizGenerator */
    private static final String SYSTEM_PROMPT =
            "You are an expert educational assessment designer. Create fair, accurate skill assessment quizzes that:\n" +
                    "- Test practical knowledge, not just theory\n" +
                    "- Are appropriate for the specified difficulty level\n" +
                    "- Include clear, unambiguous questions\n" +
                    "- Have one correct answer per question\n" +
                    "- Cover key concepts comprehensively\n\n" +
                    "Always respond with valid JSON only.";

    /* generateQuiz() - mirrors generateQuiz(skill, difficulty, questionCount) in aiService.js */
    public QuizResponse generateQuiz(QuizRequest request) {
        try {
            /* Step 1: Build prompt - mirrors buildQuizPrompt() */
            String userPrompt = buildQuizPrompt(
                    request.getSkill(),
                    request.getDifficulty(),
                    request.getQuestionCount()
            );

            /* Step 2: Call Groq API - mirrors callAI() */
            String aiResponse = groqService.callAI(SYSTEM_PROMPT, userPrompt);

            /* Step 3: Parse JSON - mirrors extractJSON() */
            QuizResponse quizData = groqService.extractJSON(aiResponse, QuizResponse.class);

            /* Step 4: Save to database */
            saveToDatabase(request, aiResponse);

            /* Step 5: Return quiz to controller */
            return quizData;

        } catch (Exception e) {
            throw new RuntimeException("Error generating quiz: " + e.getMessage());
        }
    }

    /* evaluateQuiz() - mirrors evaluateQuiz(quizData, userAnswers) in aiService.js */
    public EvaluateResponse evaluateQuiz(EvaluateRequest request) {

        /* Count correct answers - mirrors forEach loop in React */
        int correctCount = 0;
        int totalQuestions = request.getQuestions().size();

        for (EvaluateRequest.QuestionAnswerDTO question : request.getQuestions()) {
            Integer userAnswer = request.getUserAnswers().get(question.getId());
            if (userAnswer != null && userAnswer == question.getCorrectAnswer()) {
                correctCount++;
            }
        }

        /* Calculate percentage - mirrors (correctCount / totalQuestions) * 100 */
        double percentage = ((double) correctCount / totalQuestions) * 100;

        /* Determine skill level - mirrors if/else block in React */
        String level;
        String reasoning;

        if (percentage >= 80) {
            level = "Advanced";
            reasoning = String.format(
                    "You scored %s%% which demonstrates strong mastery of the concepts. You're ready for advanced topics!",
                    String.format("%.0f", percentage)
            );
        } else if (percentage >= 50) {
            level = "Intermediate";
            reasoning = String.format(
                    "You scored %s%% which shows solid foundational knowledge. You're ready to build upon the basics!",
                    String.format("%.0f", percentage)
            );
        } else {
            level = "Beginner";
            reasoning = String.format(
                    "You scored %s%% which indicates you're starting fresh. That's perfectly fine - everyone starts somewhere!",
                    String.format("%.0f", percentage)
            );
        }

        /* Build and return response - mirrors return object in React */
        EvaluateResponse response = new EvaluateResponse();
        response.setCorrectCount(correctCount);
        response.setTotalQuestions(totalQuestions);
        response.setPercentage(String.format("%.1f", percentage));
        response.setLevel(level);
        response.setReasoning(reasoning);

        return response;
    }

    /* buildQuizPrompt() - mirrors buildQuizPrompt() in promptBuilder.js with exact same prompt text */
    private String buildQuizPrompt(String skill, int difficulty, int questionCount) {
        return String.format(
                "Create a skill assessment quiz for \"%s\" with the following specifications:\n\n" +
                        "Difficulty Level: %d/5 (where 1 is very basic and 5 is very challenging)\n" +
                        "Number of Questions: %d\n\n" +
                        "Generate a quiz in this JSON format:\n" +
                        "{\n" +
                        "  \"skill\": \"%s\",\n" +
                        "  \"difficulty\": %d,\n" +
                        "  \"questions\": [\n" +
                        "    {\n" +
                        "      \"id\": 1,\n" +
                        "      \"question\": \"Question text here?\",\n" +
                        "      \"options\": [\"Option A\", \"Option B\", \"Option C\", \"Option D\"],\n" +
                        "      \"correctAnswer\": 0,\n" +
                        "      \"explanation\": \"Why this answer is correct\"\n" +
                        "    }\n" +
                        "  ]\n" +
                        "}\n\n" +
                        "Requirements:\n" +
                        "- Questions should test practical understanding\n" +
                        "- All questions should be clear and unambiguous\n" +
                        "- Each question must have exactly 4 options\n" +
                        "- correctAnswer is the index (0-3) of the correct option\n" +
                        "- Include brief explanations for learning\n" +
                        "- Return ONLY valid JSON",
                skill, difficulty, questionCount,
                skill, difficulty
        );
    }




    /* Save quiz request and AI response to database */
    private void saveToDatabase(QuizRequest request, String aiResponse) {
        Quiz quiz = new Quiz();
        quiz.setSkill(request.getSkill());
        quiz.setDifficulty(request.getDifficulty());
        quiz.setQuestionCount(request.getQuestionCount());
        quiz.setAiResponse(aiResponse);
        quizRepository.save(quiz);
    }


    /* Get all quizzes from database */
    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    /* Get quiz by ID from database */
    public QuizResponse getQuizById(Long id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + id));
        try {
            return objectMapper.readValue(quiz.getAiResponse(), QuizResponse.class);
        } catch (Exception e) {
            throw new RuntimeException("Error parsing quiz: " + e.getMessage());
        }
    }

}
