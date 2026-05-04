package com.skillroute.skillroute_backend.controller;

import com.skillroute.skillroute_backend.dto.response.DashboardStatsRes;
import com.skillroute.skillroute_backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class Dashboard {

    @Autowired
    private DashboardService dashboardService;

    /* GET /api/dashboard/stats
     * Returns user statistics for dashboard */
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsRes> getDashboardStats() {
        try {
            DashboardStatsRes stats = dashboardService.getDashboardStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}