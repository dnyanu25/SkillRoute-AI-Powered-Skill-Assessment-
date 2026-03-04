package com.skillroute.skillroute_backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "quizzes")
@Getter
@Setter
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ===================================
    // User Input Fields
    // ===================================
    @Column(nullable = false)
    private String skill;

    @Column(nullable = false)
    private int difficulty;

    @Column(nullable = false)
    private int questionCount;

    // ===================================
    // AI Response Field
    // Stores the full Groq JSON response
    // ===================================
    @Column(columnDefinition = "TEXT", nullable = false)
    private String aiResponse;

    // ===================================
    // Evaluation Results (filled after user submits answers)
    // ===================================
    private Integer correctCount;       // nullable until evaluated
    private Integer totalQuestions;     // nullable until evaluated
    private String percentage;          // e.g. "75.0"
    private String skillLevel;          // "Beginner", "Intermediate", "Advanced"

    // ===================================
    // Metadata
    // ===================================
    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}