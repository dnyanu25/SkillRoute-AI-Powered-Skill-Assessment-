package com.skillroute.skillroute_backend.controller;

import com.skillroute.skillroute_backend.dto.request.EvaluateRequest;
import com.skillroute.skillroute_backend.dto.request.QuizRequest;
import com.skillroute.skillroute_backend.dto.response.EvaluateResponse;
import com.skillroute.skillroute_backend.dto.response.QuizResponse;
import com.skillroute.skillroute_backend.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quiz")
@CrossOrigin(origins = "http://localhost:5173")
public class Quiz {

    @Autowired
    private QuizService quizService;

    /* POST /api/quiz/generate
     * Receives skill + difficulty + questionCount from React
     * Returns AI generated quiz
     * Mirrors: generateQuiz(skill, difficulty, questionCount) in React */
    @PostMapping("/generate")
    public ResponseEntity<QuizResponse> generateQuiz(
            @RequestBody QuizRequest request) {
        try {
            QuizResponse response = quizService.generateQuiz(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /* POST /api/quiz/evaluate
     * Receives quiz answers from React
     * Returns score, level and reasoning
     * Mirrors: evaluateQuiz(quizData, userAnswers) in React */
    @PostMapping("/evaluate")
    public ResponseEntity<EvaluateResponse> evaluateQuiz(
            @RequestBody EvaluateRequest request) {
        try {
            EvaluateResponse response = quizService.evaluateQuiz(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /* GET /api/quiz/all
     * Returns all saved quizzes from database */
    @GetMapping("/all")
    public ResponseEntity<?> getAllQuizzes() {
        try {
            return ResponseEntity.ok(
                    quizService.getAllQuizzes()
            );
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /* GET /api/quiz/{id}
     * Returns a specific quiz by ID */
    @GetMapping("/{id}")
    public ResponseEntity<QuizResponse> getQuizById(
            @PathVariable Long id) {
        try {
            return ResponseEntity.ok(
                    quizService.getQuizById(id)
            );
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}