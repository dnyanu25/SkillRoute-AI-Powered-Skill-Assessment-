package com.skillroute.skillroute_backend.repository;

import com.skillroute.skillroute_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {

    /* Find user by email for login */
    Optional<User> findByEmail(String email);

    /* Check if email already exists for signup */
    boolean existsByEmail(String email);

    /* Find user by reset token for forgot password */
    Optional<User> findByResetToken(String resetToken);
}