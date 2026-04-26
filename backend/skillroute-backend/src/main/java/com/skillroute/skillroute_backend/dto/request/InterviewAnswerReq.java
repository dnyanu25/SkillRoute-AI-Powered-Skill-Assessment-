package com.skillroute.skillroute_backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InterviewAnswerReq {
    private Long interviewId;      // Which interview session
    private int questionNumber;    // Which question (1, 2, 3...)
    private String question;       // The question text (so Groq has context)
    private String userAnswer;     // What the user typed
    private String skill;          // e.g. "React" (for evaluation context)
}