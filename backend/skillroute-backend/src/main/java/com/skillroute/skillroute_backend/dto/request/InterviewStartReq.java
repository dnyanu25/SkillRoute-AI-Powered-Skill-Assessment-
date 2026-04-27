package com.skillroute.skillroute_backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InterviewStartReq {

    private String skill;           // e.g., "React"
    private int difficulty;         // 1-5
    private int questionCount;
    private Long userId;  // e.g., 5 or 10
}