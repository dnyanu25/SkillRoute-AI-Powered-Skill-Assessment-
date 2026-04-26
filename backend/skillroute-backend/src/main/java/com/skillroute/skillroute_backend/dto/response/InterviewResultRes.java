package com.skillroute.skillroute_backend.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class InterviewResultRes {
    private Long interviewId;
    private String skill;
    private int difficulty;
    private String status;
    private Integer totalScore;
    private String overallFeedback;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}