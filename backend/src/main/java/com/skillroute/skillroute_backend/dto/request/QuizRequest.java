package com.skillroute.skillroute_backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuizRequest {

    private String skill;       // e.g. "JavaScript"
    private int difficulty;     // 1-5
    private int questionCount;  // e.g. 10
}