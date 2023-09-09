package com.app.jelth.domain.service.App;


import com.app.jelth.domain.mapper.app.AppRecordMapper;
import com.app.jelth.domain.model.DailyRecordD;
import com.app.jelth.domain.model.DailyRecordM;
import com.app.jelth.domain.model.MyRoutine;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
        dailyRecordMList.forEach(detail ->{
            List<DailyRecordD> dailyRecordD = appRecordMapper.getDailyRecordDList(detail);
            detail.setDailyRecordDetailList(dailyRecordD);
        });
        return dailyRecordMList;
    }

    public void DeleteRoutineMaster(DailyRecordM dailyRecordM) {
        appRecordMapper.DeleteRoutineMaster(dailyRecordM);
        appRecordMapper.UpdateRoutineSeq(dailyRecordM);
    }

    public List<HashMap<String, Object>> calendarLineRequest(Map<String, Object> calendarResult) {
        return appRecordMapper.calendarLineRequest(calendarResult);
    }

    public DailyRecordD InsertRoutineDetail(DailyRecordD dailyRecordD) {

        appRecordMapper.InsertRoutineDetail(dailyRecordD);


        return dailyRecordD;

    }

    public DailyRecordD ModifyRoutineDetail(DailyRecordD dailyRecordD) {
        appRecordMapper.ModifyRoutineDetail(dailyRecordD);
        return dailyRecordD;
    }

    public List<DailyRecordD> dailyRecordDetailDelete(DailyRecordD dailyRecordD) {
        appRecordMapper.dailyRecordDetailDelete(dailyRecordD);
        appRecordMapper.workoutRoutineSeqUpdate(dailyRecordD);

        DailyRecordM dailyRecordM = new DailyRecordM();
        dailyRecordM.setUserCode(dailyRecordD.getUserCode());
        dailyRecordM.setDailyRecordMasterCode(dailyRecordD.getDailyRecordMasterCode());
        return appRecordMapper.getDailyRecordDList(dailyRecordM);


    }
}
