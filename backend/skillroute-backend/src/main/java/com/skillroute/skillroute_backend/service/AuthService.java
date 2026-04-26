package com.skillroute.skillroute_backend.service;

import com.skillroute.skillroute_backend.dto.request.*;
import com.skillroute.skillroute_backend.dto.response.AuthRes;
import com.skillroute.skillroute_backend.entity.User;
import com.skillroute.skillroute_backend.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepo userRepo;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /* =============================================
       REGISTER
       ============================================= */
    public AuthRes register(RegisterReq request) {
        AuthRes response = new AuthRes();

        /* Check if email already exists */
        if (userRepo.existsByEmail(request.getEmail())) {
            response.setSuccess(false);
            response.setMessage("Email already registered. Please login.");
            return response;
        }

        /* Save new user with hashed password */
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepo.save(user);

        response.setSuccess(true);
        response.setMessage("Account created successfully!");
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());

        return response;
    }

    /* =============================================
       LOGIN
       ============================================= */
    public AuthRes login(LoginReq request) {
        AuthRes response = new AuthRes();

        /* Find user by email */
        Optional<User> userOpt = userRepo.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            response.setSuccess(false);
            response.setMessage("No account found with this email.");
            return response;
        }

        User user = userOpt.get();

        /* Compare password */
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            response.setSuccess(false);
            response.setMessage("Incorrect password. Please try again.");
            return response;
        }

        response.setSuccess(true);
        response.setMessage("Login successful!");
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());

        return response;
    }

    /* =============================================
       FORGOT PASSWORD
       Generates a reset token and saves it
       ============================================= */
    public AuthRes forgotPassword(ForgotPasswordReq request) {
        AuthRes response = new AuthRes();

        Optional<User> userOpt = userRepo.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            response.setSuccess(false);
            response.setMessage("No account found with this email.");
            return response;
        }

        User user = userOpt.get();

        /* Generate reset token */
        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(30));
        userRepo.save(user);

        /* In real app you'd send email — for now return token directly */
        response.setSuccess(true);
        response.setMessage("Reset token generated: " + token);

        return response;
    }

    /* =============================================
       RESET PASSWORD
       ============================================= */
    public AuthRes resetPassword(ResetPasswordReq request) {
        AuthRes response = new AuthRes();

        Optional<User> userOpt = userRepo.findByResetToken(request.getToken());

        if (userOpt.isEmpty()) {
            response.setSuccess(false);
            response.setMessage("Invalid or expired reset token.");
            return response;
        }

        User user = userOpt.get();

        /* Check token expiry */
        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            response.setSuccess(false);
            response.setMessage("Reset token has expired. Please request a new one.");
            return response;
        }

        /* Update password */
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepo.save(user);

        response.setSuccess(true);
        response.setMessage("Password reset successfully! Please login.");

        return response;
    }
}