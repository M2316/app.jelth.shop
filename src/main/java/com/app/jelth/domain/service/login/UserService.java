package com.app.jelth.domain.service.login;

import com.app.jelth.domain.mapper.user.UserMapper;
import com.app.jelth.domain.model.JelthUser;
import com.app.jelth.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.servlet.http.Cookie;

@Service
public class UserService{

    private final PasswordEncoder passwordEncoder;

    private final UserMapper userMapper;

    public UserService(PasswordEncoder passwordEncoder, UserMapper userMapper){
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;

    }




    @Value("${jwt.secret}")
    private String secretKey;

    private Long expiredMs = 1000 * 60 * 60l; // 1시간



    // ID 중복
    public boolean checkUserId(String inputId) {
        return userMapper.checkUserId(inputId) == 0;
    }

    /**
     * 회원가입 요청
     * @param jelthUser
     */
    public void setMemberJoin(JelthUser jelthUser) {


        if(this.checkUserId(jelthUser.getUId())){
            jelthUser.setUPw(passwordEncoder.encode(jelthUser.getUPw()));
            userMapper.setMemberJoin(jelthUser);
            userMapper.setBasicWorkoutListAppend(jelthUser.getUId());
        }else{
            throw new RuntimeException(jelthUser.getUId() + "는 이미 존재합니다.");
        }
    }

    /**
     * 유저 로그인 인증 method (인증 실패시 login 페이지로 이동 시킴)
     * @param jelthUser
     * @return userToken을 담은 cookie
     */
    public Cookie UserLoginRequest(JelthUser jelthUser){


        //사용자 조회후 적합한지 체크
        JelthUser dbUser = userMapper.LoginRequestUserCheck(jelthUser);
        if(dbUser == null || dbUser.getUId() == null || !passwordEncoder.matches(jelthUser.getUPw(),dbUser.getUPw())){
            throw new RuntimeException("아이디 또는 비밀번호를 확인해 주세요.");
        }

        String token = JwtUtil.createJwt(dbUser,secretKey,expiredMs);

        Cookie loginCook = new Cookie("loginToken","Bearer/" + token);
        loginCook.setMaxAge(60*60);
        loginCook.setHttpOnly(true);
        loginCook.setPath("/");



        return loginCook;

    }



    public void userLoginTimeUpdate(String uId) {
        userMapper.userLoginTimeUpdate(uId);
    }
    public void userLogoutTimeUpdate(String cookieToken){

        String uId = JwtUtil.getUserId(cookieToken.split("/")[1],secretKey);

        userMapper.userLogoutTimeUpdate(uId);
    }
}
