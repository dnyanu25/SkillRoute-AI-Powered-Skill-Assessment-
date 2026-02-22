package com.skillroute.skillroute_backend.repository;


import com.skillroute.skillroute_backend.entity.Roadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RoadmapRepository extends JpaRepository<Roadmap, Long> {

    // Find all roadmaps for a specific skill
    // SQL: SELECT * FROM roadmaps WHERE skill = ?
    List<Roadmap> findBySkill(String skill);

    // Find all roadmaps for a specific skill and level
    // SQL: SELECT * FROM roadmaps WHERE skill = ? AND level = ?
    List<Roadmap> findBySkillAndLevel(String skill, String level);

    // Find most recent roadmap
    // SQL: SELECT * FROM roadmaps ORDER BY created_at DESC LIMIT 1
    Roadmap findTopByOrderByCreatedAtDesc();
}