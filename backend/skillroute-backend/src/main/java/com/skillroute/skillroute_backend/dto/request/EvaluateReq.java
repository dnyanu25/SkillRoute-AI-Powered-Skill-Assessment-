package com.skillroute.skillroute_backend.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;
@Getter
@Setter
public class EvaluateReq {

    private int totalQuestions;
    private Map<Integer, Integer> userAnswers;
    private List<QuestionAnswerDTO> questions;
    private Long quizId;

    private Long userId;  // logged in user's id
    /* Inner class */

    @Getter
    @Setter
    public static class QuestionAnswerDTO {
        private int id;
        private int correctAnswer;

       }
}