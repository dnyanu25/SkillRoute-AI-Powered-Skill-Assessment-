// InterviewController.java

package com.skillroute.skillroute_backend.controller;

import com.skillroute.skillroute_backend.dto.request.InterviewAnswerReq;
import com.skillroute.skillroute_backend.dto.request.InterviewStartReq;
import com.skillroute.skillroute_backend.dto.response.InterviewAnswerRes;
import com.skillroute.skillroute_backend.dto.response.InterviewResultRes;
import com.skillroute.skillroute_backend.dto.response.InterviewStartRes;
import com.skillroute.skillroute_backend.service.InterviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/interviews")
@CrossOrigin(origins = "http://localhost:5173")  // Your React dev server
public class InterviewController  {

    @Autowired
    private InterviewService interviewService;



    /**
     * POST /api/interviews/start
     * Body: { "skill": "React", "difficulty": 3, "questionCount": 5 }
     */
    @PostMapping("/start")
    public ResponseEntity<InterviewStartRes> startInterview(
            @RequestBody InterviewStartReq request) {
        InterviewStartRes response = interviewService.startInterview(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/result/{id}")
    public ResponseEntity<InterviewResultRes> getResult(@PathVariable Long id) {
        InterviewResultRes response = interviewService.getResult(id);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/interviews/{id}
     * Fetch a saved interview by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getInterview(@PathVariable Long id) {
        // You can add a findById method in InterviewService later
        return ResponseEntity.ok("Interview " + id);
    }

    @PostMapping("/answer")
    public ResponseEntity<InterviewAnswerRes> evaluateAnswer(
            @RequestBody InterviewAnswerReq request) {
        InterviewAnswerRes response = interviewService.evaluateAnswer(request);
        return ResponseEntity.ok(response);
    }
}