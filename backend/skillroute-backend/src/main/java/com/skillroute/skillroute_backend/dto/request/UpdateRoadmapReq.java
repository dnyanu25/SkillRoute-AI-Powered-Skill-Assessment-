package com.skillroute.skillroute_backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateRoadmapReq {
    private Long roadmapId;
    private int completedTasks;
    private int totalTasks;
}