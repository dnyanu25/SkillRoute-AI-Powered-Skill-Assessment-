package com.skillroute.skillroute_backend.controller;

import com.skillroute.skillroute_backend.dto.request.EvaluateReq;
import com.skillroute.skillroute_backend.dto.request.QuizReq;
import com.skillroute.skillroute_backend.dto.response.EvaluateRes;
import com.skillroute.skillroute_backend.dto.response.QuizRes;
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
     * Returns AI generated quizc
     * Mirrors: generateQuiz(skill, difficulty, questionCount) in React */

    @PostMapping("/generate")
    public ResponseEntity<QuizRes> generateQuiz(
            @RequestBody QuizReq request) {
        try {
            QuizRes response = quizService.generateQuiz(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Quiz error: " + e.getMessage());

            return ResponseEntity.internalServerError().build();  }
    }
    /* POST /api/quiz/evaluate
     * Receives quiz answers from React
     * Returns score, level and reasoning
     */
    @PostMapping("/evaluate")
    public ResponseEntity<EvaluateRes> evaluateQuiz(@RequestBody EvaluateReq request) {
        try {
            EvaluateRes response = quizService.evaluateQuiz(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Quiz error: " + e.getMessage());
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
            System.out.println("Quiz error: " + e.getMessage());

            return ResponseEntity.internalServerError().build();
        } }
    /* GET /api/quiz/{id}
     * Returns a specific quiz by ID */
    @GetMapping("/{id}")
    public ResponseEntity<QuizRes> getQuizById(
            @PathVariable Long id) {
        try {
            return ResponseEntity.ok(
                    quizService.getQuizById(id) );
        } catch (Exception e) {
            System.out.println("Quiz error: " + e.getMessage());

            return ResponseEntity.notFound().build();
        }
    }
}