package com.skillroute.skillroute_backend.controller;

import com.skillroute.skillroute_backend.dto.request.RoadmapReq;
import com.skillroute.skillroute_backend.dto.response.RoadmapRes;
import com.skillroute.skillroute_backend.service.RoadmapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/roadmap") 
@CrossOrigin(origins = "http://localhost:5173")
public class Roadmap {

    @Autowired
    private RoadmapService roadmapService;

    /* POST /api/roadmap/generate
     * Receives user info from React form
     * Returns AI generated roadmap
     * Mirrors: generateRoadmap(userInfo) call in React */
    @PostMapping("/generate")
    public ResponseEntity<RoadmapRes> generateRoadmap(
            @RequestBody RoadmapReq request) {
        try {
            RoadmapRes response = roadmapService.generateRoadmap(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /* GET /api/roadmap/all
     * Returns all saved roadmaps from database
     * Useful for history/dashboard feature */
    @GetMapping("/all")
    public ResponseEntity<?> getAllRoadmaps() {
        try {
            return ResponseEntity.ok(
                    roadmapService.getAllRoadmaps()
            );
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /* GET /api/roadmap/{id}
     * Returns a specific roadmap by ID */
    @GetMapping("/{id}")
    public ResponseEntity<RoadmapRes> getRoadmapById(
            @PathVariable Long id) {
        try {
            return ResponseEntity.ok(
                    roadmapService.getRoadmapById(id)
            );
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
