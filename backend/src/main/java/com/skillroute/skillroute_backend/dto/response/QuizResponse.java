package com.skillroute.skillroute_backend.dto.response;


import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class QuizResponse {

    private String skill;
    private int difficulty;
    private List<QuestionDTO> questions;

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