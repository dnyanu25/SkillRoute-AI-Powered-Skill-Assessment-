package com.skillroute.skillroute_backend.repository;

import com.skillroute.skillroute_backend.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InterviewRepo extends JpaRepository<Interview, Long> {

    /* Find all interviews by skill */
    List<Interview> findBySkill(String skill);

    /* Find all interviews by status */
    List<Interview> findByStatus(String status);

    /* Find all completed interviews (for history) */
    List<Interview> findByStatusOrderByCreatedAtDesc(String status);
}