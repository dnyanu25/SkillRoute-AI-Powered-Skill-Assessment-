package com.skillroute.skillroute_backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuizReq {

    private String skill;
    private int difficulty;
    private int questionCount;


}