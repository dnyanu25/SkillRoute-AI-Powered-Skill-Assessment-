package com.skillroute.skillroute_backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoadmapRequest {

    private String skill;           // e.g. "React"
    private String level;           // e.g. "Beginner"
    private int duration;           // e.g. 4
    private String durationType;    // e.g. "weeks"
    private boolean includePractice;
    private boolean includeProjects;
    private boolean includeRevision;
    private String goals;           // optional, can be null
}