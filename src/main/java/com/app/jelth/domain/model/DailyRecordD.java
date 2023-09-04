package com.app.jelth.domain.model;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;

@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class DailyRecordD extends BasicModel{
    private String dailyRecordDetailCode;
    private String dailyRecordMasterCode;
    private String userCode;
    private String myRoutineListCode;
    private Integer workoutRoutineSeq;
    private Integer workoutIterationsCount;
    private Integer workoutSetWeight;
    private String workoutDoneYn;
}
