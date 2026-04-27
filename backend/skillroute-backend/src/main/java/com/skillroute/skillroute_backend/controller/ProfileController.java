package com.skillroute.skillroute_backend.controller;

import com.skillroute.skillroute_backend.entity.Interview;
import com.skillroute.skillroute_backend.entity.Quiz;
import com.skillroute.skillroute_backend.entity.Roadmap;
import com.skillroute.skillroute_backend.repository.InterviewRepo;
import com.skillroute.skillroute_backend.repository.QuizRepo;
import com.skillroute.skillroute_backend.repository.RoadmapRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173")
public class ProfileController {

    @Autowired
    private QuizRepo quizRepo;

    @Autowired
    private InterviewRepo interviewRepo;

    @Autowired
    private RoadmapRepo roadmapRepo;

    /* GET /api/profile/{userId}
       Returns all history for a user */
    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> getProfile(@PathVariable Long userId) {
        List<Quiz> quizzes = quizRepo.findByUserIdOrderByCreatedAtDesc(userId);
        List<Interview> interviews = interviewRepo.findByUserIdOrderByCreatedAtDesc(userId);
        List<Roadmap> roadmaps = roadmapRepo.findByUserIdOrderByCreatedAtDesc(userId);

        /* Build stats */
        double avgQuizScore = quizzes.stream()
                .filter(q -> q.getPercentage() != null)
                .mapToDouble(q -> Double.parseDouble(q.getPercentage()))
                .average()
                .orElse(0);

        double avgInterviewScore = interviews.stream()
                .filter(i -> i.getTotalScore() != null)
                .mapToDouble(i -> i.getTotalScore())
                .average()
                .orElse(0);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalQuizzes", quizzes.size());
        stats.put("avgQuizScore", Math.round(avgQuizScore));
        stats.put("totalInterviews", interviews.size());
        stats.put("avgInterviewScore", Math.round(avgInterviewScore));
        stats.put("skillsLearning", roadmaps.size());

        /* Build response */
        Map<String, Object> response = new HashMap<>();
        response.put("stats", stats);
        response.put("quizzes", quizzes.stream().map(q -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", q.getId());
            map.put("skill", q.getSkill());
            map.put("score", q.getPercentage() != null ? Double.parseDouble(q.getPercentage()) : 0);
            map.put("totalQuestions", q.getQuestionCount());
            map.put("difficulty", q.getDifficulty());
            map.put("date", q.getCreatedAt().toLocalDate().toString());
            return map;
        }).toList());

        response.put("interviews", interviews.stream().map(i -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", i.getId());
            map.put("skill", i.getSkill());
            map.put("score", i.getTotalScore() != null ? i.getTotalScore() : 0);
            map.put("totalQuestions", i.getQuestionCount());
            map.put("difficulty", i.getDifficulty());
            map.put("date", i.getCreatedAt().toLocalDate().toString());
            return map;
        }).toList());

        response.put("roadmaps", roadmaps.stream().map(r -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", r.getId());
            map.put("skill", r.getSkill());
            map.put("level", r.getLevel());
            map.put("duration", r.getDuration() + " " + r.getDurationType());
            map.put("completedTasks", 0);
            map.put("totalTasks", 0);
            map.put("date", r.getCreatedAt().toLocalDate().toString());
            return map;
        }).toList());

        return ResponseEntity.ok(response);
    }
}