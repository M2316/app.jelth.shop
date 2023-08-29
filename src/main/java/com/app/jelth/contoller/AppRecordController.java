package com.app.jelth.contoller;

import com.app.jelth.domain.model.DailyRecordM;
import com.app.jelth.domain.model.JelthUser;
import com.app.jelth.domain.model.MyRoutine;
import com.app.jelth.domain.service.App.AppRecordService;
import com.app.jelth.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api/app1")
public class AppRecordController {


    @Value("${jwt.secret}")
    private String secretKey;

    private final AppRecordService appRecordService;


    public AppRecordController(AppRecordService appRecordService){
        this.appRecordService = appRecordService;
    }

    @GetMapping("/recordPage")
    public ModelAndView AppRecordPageReqeust(ModelAndView modelAndView, HttpServletResponse response, HttpServletRequest request){

        modelAndView.setViewName("app1/recordApp");

        return modelAndView;
    }


    @PostMapping("/getMyRoutineList")
    @ResponseBody
    public List<MyRoutine> getMyRoutineList(HttpServletResponse response, HttpServletRequest request, @CookieValue(value = "loginToken", required = false) String loginToken){

        String userCode = JwtUtil.getUserCode(loginToken.split("/")[1],secretKey);
        System.out.println(userCode);
        List<MyRoutine> routineList = appRecordService.getMyRoutineList(userCode);

        return routineList ;
    }

    @PostMapping("/InsertMyRoutine")
    @ResponseBody
    public String InsertMyRoutine(@RequestBody MyRoutine myRoutine,@CookieValue(value = "loginToken", required = false) String loginToken){

        //유저 정보를 가져와서 셋팅
        myRoutine.setUserCode(getTokenInfoUserCode(loginToken));
        myRoutine.setInsertUser(getTokenInfoUserId(loginToken));

        //service랑 mapper 만들어서 DB 넣는것 까지 하기~~~~
        appRecordService.insertMyRoutine(myRoutine);

        System.out.println("test");
        return "저장성공~";
    }

    @PostMapping("/ModifyMyRoutine")
    @ResponseBody
    public String ModifyMyRoutine(@RequestBody MyRoutine myRoutine,@CookieValue(value = "loginToken", required = false) String loginToken){

        //유저 정보를 가져와서 셋팅
        myRoutine.setUserCode(getTokenInfoUserCode(loginToken));
        myRoutine.setInsertUser(getTokenInfoUserId(loginToken));

        appRecordService.ModifyMyRoutine(myRoutine);
        return "수정성공~!";
    }

    @PostMapping("/DeleteMyRoutine")
    @ResponseBody
    public String DeleteMyRoutine(@RequestBody MyRoutine myRoutine,@CookieValue(value = "loginToken", required = false) String loginToken){
        //유저 정보를 가져와서 셋팅
        myRoutine.setUserCode(getTokenInfoUserCode(loginToken));
        appRecordService.DeleteMyRoutine(myRoutine);

        return "삭제성공~!";
    }

    @PostMapping("/dayilRoutineAppend")
    @ResponseBody
    public String dayilRoutineAppend(@RequestBody List<DailyRecordM> dailyRecordMList, @CookieValue(value = "loginToken", required = false) String loginToken){
        //List 안에있는 항목에 userCode 넣기
        dailyRecordMList.forEach(dailyRecordM -> dailyRecordM.setUserCode(getTokenInfoUserCode(loginToken)));
        appRecordService.dayilRoutineAppend(dailyRecordMList);


        return "DayilRoutine추가 성공~!";
    }

    @PostMapping("/dailyRoutineMasterRequest")
    @ResponseBody
    public List<DailyRecordM> dailyRoutineMasterRequest(@RequestBody DailyRecordM dailyRecordM, @CookieValue(value ="loginToken", required = false) String loginToken){
        //List 안에있는 항목에 userCode 넣기
        dailyRecordM.setUserCode(getTokenInfoUserCode(loginToken));
        List<DailyRecordM> DailyRecordMList = appRecordService.getDailyRecordMList(dailyRecordM);
        return DailyRecordMList;
    }

    @PostMapping("/DeleteRoutineMaster")
    @ResponseBody
    public String DeleteRoutineMaster(@RequestBody DailyRecordM dailyRecordM, @CookieValue(value ="loginToken", required = false) String loginToken){
        //List 안에있는 항목에 userCode 넣기
        dailyRecordM.setUserCode(getTokenInfoUserCode(loginToken));
        appRecordService.DeleteRoutineMaster(dailyRecordM);
        return "Routine 삭제 성공~!";
    }
    @PostMapping("/calendarLineRequest")
    @ResponseBody
    public List<HashMap<String, Object>> calendarLineRequest(@RequestBody Map<String, Object> calendarResult, @CookieValue(value ="loginToken", required = false) String loginToken){
        //List 안에있는 항목에 userCode 넣기
        calendarResult.put("userCode",getTokenInfoUserCode(loginToken));
        String calendarMonth;
        if(Integer.parseInt(calendarResult.get("resultMonth")+"") >= 10){
            calendarMonth =  calendarResult.get("resultYear")+"-"+calendarResult.get("resultMonth");
        }else{
            calendarMonth =  calendarResult.get("resultYear")+"-0"+calendarResult.get("resultMonth");
        }
        calendarResult.put("calendarMonth",calendarMonth);
        List<HashMap<String, Object>> attendanceList = appRecordService.calendarLineRequest(calendarResult);
        return attendanceList;
    }
    /**
     * 토큰에서 uId 꺼내는 함수
     * @Params String loginToken 로그인 정보가 담긴 토큰
     */
    private String getTokenInfoUserId(String loginToken){
        return JwtUtil.getUserId(loginToken.split("/")[1],secretKey);
    }
    /**
     * 토큰에서 userCode 꺼내는 함수
     */
    private String getTokenInfoUserCode(String loginToken){
        return JwtUtil.getUserCode(loginToken.split("/")[1],secretKey);
    }
}
