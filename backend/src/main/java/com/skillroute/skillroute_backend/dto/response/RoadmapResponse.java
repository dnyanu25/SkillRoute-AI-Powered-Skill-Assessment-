package com.skillroute.skillroute_backend.dto.response;


import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class RoadmapResponse {

    private String skill;
    private String level;
    private int planDuration;
    private String planType;
    private List<WeekDTO> weeks;

    @Getter
    @Setter
    public static class WeekDTO {
        private int week;
        private String title;
        private boolean completed;
        private List<TaskDTO> tasks;
    }

    @Getter
    @Setter
    public static class TaskDTO {
        private int id;
        private String task;
        private boolean completed;
    }
}