package com.app.jelth.domain.mapper.user;

import com.app.jelth.domain.model.JelthUser;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {

    void setMemberJoin(JelthUser jelthUser);

    Integer checkUserId(String inputId);

    JelthUser LoginRequestUserCheck(JelthUser jelthUser);

    void userLoginTimeUpdate(String uId);
    void userLogoutTimeUpdate(String uId);

    void setBasicWorkoutListAppend(String uId);
}
