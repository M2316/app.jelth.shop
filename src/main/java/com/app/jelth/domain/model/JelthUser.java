package com.app.jelth.domain.model;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;
import lombok.ToString;

@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class JelthUser {

    private String userCode;
    private String uId;
    private String uPw;
    private String uName;
    private float uBodyHeight;
    private float uBodyWeight;
    private String tokenCode;


}
