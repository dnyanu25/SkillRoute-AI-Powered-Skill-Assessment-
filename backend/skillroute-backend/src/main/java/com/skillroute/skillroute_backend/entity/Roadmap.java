package com.skillroute.skillroute_backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "roadmaps")
@Getter
@Setter
public class Roadmap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ===================================
    // User Input Fields for roadmap .
    // ===================================
    @Column(nullable = false)
    private String skill;

    // Add this field
    @Column
    private Long userId;

    @Column(nullable = false)
    private String level;

    @Column(nullable = false)
    private int duration;

    @Column(nullable = false)
    private String durationType;

    private boolean includePractice;
    private boolean includeProjects;
    private boolean includeRevision;

    @Column(columnDefinition = "TEXT")
    private String goals;

    // ===================================
    // AI Response Field
    // Stores the full Groq JSON response
    // ===================================
    @Column(columnDefinition = "TEXT", nullable = false)
    private String aiResponse;

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