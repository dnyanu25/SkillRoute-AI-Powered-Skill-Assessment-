package com.skillroute.skillroute_backend.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InterviewAnswerRes {
    private int questionNumber;
    private int score;           // 0-10
    private String feedback;     // "Good, but you missed X..."
    private String idealAnswer;  // What a great answer looks like
    private boolean isLast;      // So React knows to show "View Results" button
}