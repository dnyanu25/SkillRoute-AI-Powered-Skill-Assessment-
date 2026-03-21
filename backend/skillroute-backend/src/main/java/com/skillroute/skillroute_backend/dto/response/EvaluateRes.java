package com.skillroute.skillroute_backend.dto.response;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EvaluateRes {

    private int correctCount;
    private int totalQuestions;
    private String percentage;  // stored as "75.0" to match your toFixed(1)
    private String level;       // "Beginner", "Intermediate", "Advanced"
    private String reasoning;   // explanati on message
}