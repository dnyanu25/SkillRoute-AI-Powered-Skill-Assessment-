package com.skillroute.skillroute_backend.controller;

import com.skillroute.skillroute_backend.dto.request.*;
import com.skillroute.skillroute_backend.dto.response.AuthRes;
import com.skillroute.skillroute_backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

    /* POST /api/auth/register */
    @PostMapping("/register")
    public ResponseEntity<AuthRes> register(@RequestBody RegisterReq request) {
        AuthRes response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    /* POST /api/auth/login */
    @PostMapping("/login")
    public ResponseEntity<AuthRes> login(@RequestBody LoginReq request) {
        AuthRes response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /* POST /api/auth/forgot-password */
    @PostMapping("/forgot-password")
    public ResponseEntity<AuthRes> forgotPassword(@RequestBody ForgotPasswordReq request) {
        AuthRes response = authService.forgotPassword(request);
        return ResponseEntity.ok(response);
    }

    /* POST /api/auth/reset-password */
    @PostMapping("/reset-password")
    public ResponseEntity<AuthRes> resetPassword(@RequestBody ResetPasswordReq request) {
        AuthRes response = authService.resetPassword(request);
        return ResponseEntity.ok(response);
    }
}