package com.app.jelth.domain.model;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;

@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class MyRoutine extends BasicModel{

    private String myRoutineListCode;
    private String userCode;
    private String routineCode;
    private String routineName;
    private String routineTypeB;
    private String routineTypeA;
    private String routineTypeC;
    private String routineTypeD;

}
