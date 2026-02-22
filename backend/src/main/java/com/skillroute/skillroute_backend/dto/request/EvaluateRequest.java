package com.skillroute.skillroute_backend.dto.request;

import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class EvaluateRequest {

    private int totalQuestions;
    private Map<Integer, Integer> userAnswers;   // {questionIndex: selectedOptionIndex}
    private List<QuestionAnswerDTO> questions;   // to check correct answers

    @Getter
    @Setter
    public static class QuestionAnswerDTO {
        private int id;
        private int correctAnswer;  // 0-3 index
    }
}