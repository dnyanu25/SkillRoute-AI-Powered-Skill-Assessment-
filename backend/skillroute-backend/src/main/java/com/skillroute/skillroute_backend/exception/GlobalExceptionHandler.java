package com.skillroute.skillroute_backend.exception;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /* Handles AI/Groq API failures
     * Mirrors: throw new Error('Failed to get response from AI') in aiService.js */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(
            RuntimeException ex) {
        return buildErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                ex.getMessage(),
                "RUNTIME_ERROR"
        );
    }

    //Map<String, Object> errorBody = new HashMap<>();

    /* Handles invalid request body / missing fields */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(
            IllegalArgumentException ex) {
        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                ex.getMessage(),
                "INVALID_REQUEST"
        );
    }

    /* Handles resource not found errors
     * e.g. GET /api/roadmap/{id} with invalid ID */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFoundException(
            ResourceNotFoundException ex) {
        return buildErrorResponse(
                HttpStatus.NOT_FOUND,
                ex.getMessage(),
                "NOT_FOUND"
        );
    }

    /* Handles Groq API specific errors */
    @ExceptionHandler(AIServiceException.class)
    public ResponseEntity<Map<String, Object>> handleAIServiceException(
            AIServiceException ex) {
        return buildErrorResponse(
                HttpStatus.SERVICE_UNAVAILABLE,
                ex.getMessage(),
                "AI_SERVICE_ERROR"
        );
    }

    /* Catch-all for any unexpected errors */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(
            Exception ex) {
        return buildErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred. Please try again.",
                "UNEXPECTED_ERROR"
        );
    }

    /* Builds a clean JSON error response
     * React will receive this instead of a stack trace */
    private ResponseEntity<Map<String, Object>> buildErrorResponse(
            HttpStatus status,
            String message,
            String errorCode) {

        Map<String, Object> errorBody = new HashMap<String, Object>();
        errorBody.put("status", status.value());         /* e.g. 500 */
        errorBody.put("error", errorCode);               /* e.g. "AI_SERVICE_ERROR" */
        errorBody.put("message", message);               /* human readable message */
        errorBody.put("timestamp", LocalDateTime.now()); /* when error occurred */

        return new ResponseEntity<>(errorBody, status);
    }
}