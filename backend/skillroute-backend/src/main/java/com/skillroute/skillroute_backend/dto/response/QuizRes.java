package com.skillroute.skillroute_backend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
public class QuizRes {

    private String skill;
    private int difficulty;
    private List<QuestionDTO> questions;
    private int questionCount;

    private Long id;      // quiz id from database
    private Long userId;  // logged in user's id


    @Getter
    @Setter
    public static class QuestionDTO {

        private int id;
        private String question;
        private List<String> options;
        private int correctAnswer;
        private String explanation;

        }
}