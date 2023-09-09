package com.app.jelth.domain.mapper.app;

import com.app.jelth.domain.model.DailyRecordD;
import com.app.jelth.domain.model.DailyRecordM;
import com.app.jelth.domain.model.MyRoutine;
import org.apache.ibatis.annotations.Mapper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Mapper
public interface AppRecordMapper {


    List<MyRoutine> getMyRoutineList(String userCode);


    void insertMyRoutine(MyRoutine myRoutine);

    void ModifyMyRoutine(MyRoutine myRoutine);

    void DeleteMyRoutine(MyRoutine myRoutine);


    void dayilRoutineAppend(DailyRecordM dailyRecordM);

    List<DailyRecordM> getDailyRecordMList(DailyRecordM dailyRecordM);

    void DeleteRoutineMaster(DailyRecordM dailyRecordM);
    void UpdateRoutineSeq(DailyRecordM dailyRecordM);

    List<HashMap<String, Object>> calendarLineRequest(Map<String, Object> calendarResult);

    int InsertRoutineDetail(DailyRecordD dailyRecordD);

    List<DailyRecordD> getDailyRecordDList(DailyRecordM dailyRecordM);

    void ModifyRoutineDetail(DailyRecordD dailyRecordD);

    int dailyRecordDetailDelete(DailyRecordD dailyRecordD);

    void workoutRoutineSeqUpdate(DailyRecordD dailyRecordD);
}

