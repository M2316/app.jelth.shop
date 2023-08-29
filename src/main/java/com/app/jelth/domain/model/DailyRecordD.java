package com.app.jelth.domain.model;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;

@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class DailyRecordD extends BasicModel{
    private String dailyRecordDCode;
    private String dailyRecordMCode;
    private String userCode;
    private String myRoutineListCode;
    private String workoutRoutineSeq;
    private String workoutIterationsCount;
    private String workoutSetWeight;
    private String workoutDoneYn;
}
