package com.app.jelth.domain.model;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;

@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class BasicModel {
    private String insertTime;
    private String insertUser;
    private String updateTime;
    private String updateUser;

}
