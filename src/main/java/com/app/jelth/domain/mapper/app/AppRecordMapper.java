package com.app.jelth.domain.mapper.app;

import com.app.jelth.domain.model.DailyRecordM;
import com.app.jelth.domain.model.MyRoutine;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface AppRecordMapper {


    List<MyRoutine> getMyRoutineList(String userCode);


    void insertMyRoutine(MyRoutine myRoutine);

    void ModifyMyRoutine(MyRoutine myRoutine);

    void DeleteMyRoutine(MyRoutine myRoutine);


    void dayilRoutineAppend(DailyRecordM dailyRecordM);

    List<DailyRecordM> getDailyRecordMList(DailyRecordM dailyRecordM);
}
