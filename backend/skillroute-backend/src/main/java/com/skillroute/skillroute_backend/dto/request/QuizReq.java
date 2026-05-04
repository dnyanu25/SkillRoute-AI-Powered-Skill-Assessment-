package com.skillroute.skillroute_backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuizReq {

    // Add this ↓
    private Long userId;  // logged in user's id
    private String skill;
    private int difficulty;
    private int questionCount;


}