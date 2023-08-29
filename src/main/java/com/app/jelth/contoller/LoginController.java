package com.app.jelth.contoller;


import com.app.jelth.domain.model.JelthUser;
import com.app.jelth.domain.service.login.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller
@RequestMapping("/")
public class LoginController {




    private final UserService userService;

    public LoginController(UserService userService){
        this.userService = userService;
    }

    @GetMapping("/login")
    public ModelAndView LoginPageRequest(ModelAndView modelAndView,HttpServletRequest request,@CookieValue(value = "loginToken",required = false)Cookie loginToken){

        //인증된 사람이라면 바로 App을 사용할 수 있도록 자동 로그인
        if(loginToken != null){
            modelAndView.setViewName("redirect:/api/app1/recordPage");
        }else{
            modelAndView.setViewName("loginPage/login");
        }

        modelAndView.addObject("msg",request.getParameter("msg"));

        return modelAndView;
    }

    @GetMapping("/join")
    public String JoinPageRequest(){
        return "loginPage/join";
    }


    /**
     * 로그인 인증후 쿠키로 token 전달
     * @param jelthUser
     * @param modelAndView
     * @param response
     * @return
     */
    @PostMapping("/login")
    public ModelAndView UserLoginAccess(JelthUser jelthUser, ModelAndView modelAndView, HttpServletResponse response){

        //인증 요청하고 token 인증 되면 토큰 발급하는 service
        Cookie loginCook = userService.UserLoginRequest(jelthUser);
        response.addCookie(loginCook);

        userService.userLoginTimeUpdate(jelthUser.getUId());
        modelAndView.setViewName("redirect:/api/app1/recordPage");

        return modelAndView;
    }

    @PostMapping("/memberJoin")
    public ModelAndView setMemberJoinRequest(JelthUser jelthUser, HttpServletRequest request,ModelAndView modelAndView){


        userService.setMemberJoin(jelthUser);

        modelAndView.setViewName("redirect:/login");
        modelAndView.addObject("msg","회원가입 완료 되었습니다.");
        return modelAndView;
    }


    @PostMapping("/memberIdCheck")
    @ResponseBody
    public String checkMemberId(@RequestBody String memberId){
        String msg = userService.checkUserId(memberId.toLowerCase())?"OK":"NO";
        return msg;

    }


    @GetMapping("/userLogout")
    public ModelAndView userLogout(ModelAndView modelAndView, HttpServletResponse response,@CookieValue(value = "loginToken", required = false) Cookie loginToken){

        loginToken.setMaxAge(0);
        loginToken.setPath("/");
        response.addCookie(loginToken);
        userService.userLogoutTimeUpdate(loginToken.getValue());

        modelAndView.setViewName("loginPage/login");
        modelAndView.addObject("msg","로그아웃 되었습니다.");


        return modelAndView;

    }

}
