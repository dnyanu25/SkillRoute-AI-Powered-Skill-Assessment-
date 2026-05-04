package com.skillroute.skillroute_backend.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DashboardStatsRes {

    private int totalQuizzes;
    private double avgQuizScore;
    private int totalInterviews;
    private double avgInterviewScore;
    private int skillsLearning;  // Count of unique roadmaps
}