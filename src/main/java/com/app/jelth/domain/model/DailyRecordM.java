package com.app.jelth.domain.model;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;

import java.util.List;

@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class DailyRecordM extends BasicModel{
    private String dailyRecordMCode;
    private String userCode;
    private String myRoutineListCode;
    private String routineTypeA;
    private String routineSeq;
    private String routineRecordDate;
    private String routineName;
    private List<DailyRecordD> DailyRecordDList;
}
