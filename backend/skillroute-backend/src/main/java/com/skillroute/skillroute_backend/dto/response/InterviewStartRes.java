package com.skillroute.skillroute_backend.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class InterviewStartRes {

    private Long interviewId;       // So React can reference this interview
    private String skill;
    private int difficulty;
    private String status;          // "in_progress"
    private List<QuestionDTO> questions;  // All interview questions

    @Getter
    @Setter
    public static class QuestionDTO {
        private int questionNumber;     // 1, 2, 3...
        private String question;        // The actual question text
    }
}