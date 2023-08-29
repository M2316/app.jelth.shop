package com.app.jelth.domain.service.App;


import com.app.jelth.domain.mapper.app.AppRecordMapper;
import com.app.jelth.domain.model.DailyRecordM;
import com.app.jelth.domain.model.MyRoutine;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppRecordService {

    private final AppRecordMapper appRecordMapper;

    public AppRecordService(AppRecordMapper appRecordMapper){
        this.appRecordMapper = appRecordMapper;
    }


    public List<MyRoutine> getMyRoutineList(String userCode){

        return appRecordMapper.getMyRoutineList(userCode);
    }

    public void insertMyRoutine(MyRoutine myRoutine) {


        appRecordMapper.insertMyRoutine(myRoutine);
    }
    public void ModifyMyRoutine(MyRoutine myRoutine){
        appRecordMapper.ModifyMyRoutine(myRoutine);
    }

    public void DeleteMyRoutine(MyRoutine myRoutine) {
        appRecordMapper.DeleteMyRoutine(myRoutine);
    }

    public void dayilRoutineAppend(List<DailyRecordM> dailyRecordMList) {
        dailyRecordMList.forEach(appRecordMapper::dayilRoutineAppend);
    }

    public List<DailyRecordM> getDailyRecordMList(DailyRecordM dailyRecordM) {

        List<DailyRecordM> dailyRecordMList = appRecordMapper.getDailyRecordMList(dailyRecordM);
        return dailyRecordMList;
    }
}
