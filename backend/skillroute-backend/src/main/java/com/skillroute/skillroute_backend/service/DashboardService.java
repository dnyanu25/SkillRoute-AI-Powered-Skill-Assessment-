package com.skillroute.skillroute_backend.service;

import com.skillroute.skillroute_backend.dto.response.DashboardStatsRes;
import com.skillroute.skillroute_backend.entity.Quiz;
import com.skillroute.skillroute_backend.entity.Roadmap;
import com.skillroute.skillroute_backend.repository.QuizRepo;
import com.skillroute.skillroute_backend.repository.RoadmapRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    @Autowired
    private QuizRepo quizRepo;

    @Autowired
    private RoadmapRepo roadmapRepo;

    /* Get dashboard statistics */
    public DashboardStatsRes getDashboardStats() {
        DashboardStatsRes stats = new DashboardStatsRes();

        /* Total quizzes taken */
        stats.setTotalQuizzes((int) quizRepo.count());

        /* Average quiz score - only from evaluated quizzes */
        List<Quiz> evaluatedQuizzes = quizRepo.findAll().stream()
                .filter(q -> q.getPercentage() != null)
                .toList();

        if (!evaluatedQuizzes.isEmpty()) {
            double avgScore = evaluatedQuizzes.stream()
                    .mapToDouble(q -> Double.parseDouble(q.getPercentage()))
                    .average()
                    .orElse(0.0);
            stats.setAvgQuizScore(Math.round(avgScore * 10.0) / 10.0); // Round to 1 decimal
        } else {
            stats.setAvgQuizScore(0.0);
        }

        /* Total interviews - will be 0 for now until we save interview results */
        stats.setTotalInterviews(0);  // TODO: Add when interview evaluation is implemented
        stats.setAvgInterviewScore(0.0);

        /* Skills learning - count unique roadmaps */
        stats.setSkillsLearning((int) roadmapRepo.count());

        return stats;
    }
}