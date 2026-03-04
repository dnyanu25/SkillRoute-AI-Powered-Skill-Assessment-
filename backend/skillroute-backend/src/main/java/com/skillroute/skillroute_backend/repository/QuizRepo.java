package com.skillroute.skillroute_backend.repository;

import com.skillroute.skillroute_backend.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizRepo extends JpaRepository<Quiz, Long> {

    // Find all quizzes for a specific skill
    // SQL: SELECT * FROM quizzes WHERE skill = ?
    List<Quiz> findBySkill(String skill);

    // Find all quizzes by skill and difficulty
    // SQL: SELECT * FROM quizzes WHERE skill = ? AND difficulty = ?
    List<Quiz> findBySkillAndDifficulty(String skill, int difficulty);

    // Find most recent quiz
    // SQL: SELECT * FROM quizzes ORDER BY created_at DESC LIMIT 1
    Quiz findTopByOrderByCreatedAtDesc();
}