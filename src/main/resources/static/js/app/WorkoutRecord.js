// 0. Page Ready Function
// 1. 이벤트 제어 function
// 2. DOM 제어 funtion
// 3. 데이터 연산 function
// 4. AJAX 처리 function
// 5. 기타 function

/* 0. Page Ready Function
 * - 이벤트를 jquery로 처리
 */


let appendRoutineList=[];


$(function(){
    let browserType = window.navigator.userAgent.toLowerCase();

    //모바일 호환성 증가를 위해 height size 동적 변경
    // if(browserType.includes("safari") && !browserType.includes("whale") && !browserType.includes("windows")){
    //     let infoMsg = "Jelth Web App은 Naver Whale 브라우저를 권장합니다. 설치를 위해 이동합니다.";
    //     alert(infoMsg);
    //     location.href = "https://whale.naver.com";
    // }else if(browserType.includes("whale")){
    //
    // }
    //모바일 화면에서 하단 브라우저로 가려지는 부분을 해결하기 위함 END
    // 추후 브라우저 호환성 업데이트가 필요함 ...





    pageElementEventAdd("All");
    AjaxRequest("myRoutineListRequest"); //우측 사이드바에 routine목록 로딩

    let data = {
        routine_record_date:nowSelectDate()
    }


    setTimeout((e)=>{
        $('.routine-list-checkbox').toggleClass("displayNone");
        $('.routine-modify-btn-box').toggleClass("displayNone");
        AjaxRequest("dailyRoutineMasterRequest",data);
    },500)

});

/* 1. 이벤트 제어 function
 * - 이벤트를 jquery로 처리
 */
/**
 * Element Event 관리 함수
 * @param flag Element 선택자 넣어주면 됨
 */
function pageElementEventAdd(flag){
    if(flag !== 'All'){
        $(flag).off();
    }
    switch (flag){
        case "All":
        case ".routine-modify-btn":
            $(".routine-modify-btn").on("click",(e)=>{
                let selRoutineInput = e.currentTarget.parentElement.parentElement.querySelector('input');
                $('#routineName').val(selRoutineInput.dataset.routineName);

                document.querySelector('#routineName').dataset.myRoutineListCode = selRoutineInput.dataset.myRoutineListCode;
                document.querySelector('#routineName').dataset.routineName = selRoutineInput.dataset.routineName;
                document.querySelector('#routineName').dataset.routineTypeA = selRoutineInput.dataset.routineTypeA;
                document.querySelector('#routineName').dataset.routineTypeB = selRoutineInput.dataset.routineTypeB;
                document.querySelector('#routineName').dataset.routineTypeC = selRoutineInput.dataset.routineTypeC;
                document.querySelector('#routineName').dataset.routineTypeD = selRoutineInput.dataset.routineTypeD;
                $('#rightRoutineModifyModal').toggleClass('displayNone');
            });
            if(flag === ".routine-modify-btn") break;
        case "All":
        case ".routine-list-add-btn":
            $(".routine-list-add-btn").on("click",(e,target)=>{
                let typeD = e.currentTarget.dataset.typeD;
                let typeC = typeD=="하체"?"하체":"상체";
                let data = [{
                    routine_name:"운동명을 수정해 주세요.",
                    routine_type_a:"중량운동",
                    routine_type_b:"프리웨이트",
                    routine_type_c:typeC,
                    routine_type_d:typeD,
                    flag:"insert"
                }];
                AjaxRequest("myRoutineListAdd",data);
                AjaxRequest("myRoutineListRequest");

            });
            if(".routine-list-add-btn" === flag) break;
        case "All":
        case "#modifyNoBtn":
            $('#modifyNoBtn').on("click",(e)=>{
                $('#rightRoutineModifyModal').toggleClass('displayNone');
                $('#routineName').val("");
            });

            if("#modifyNoBtn" === flag) break;
        case "All":
        case ".routine-list-input":
            $('.routine-list-input').on("change",(e)=>{
                if(e.currentTarget.checked){
                    let selDate = nowSelectDate();
                    appendRoutineList.push(
                        {
                            my_routine_list_code:e.currentTarget.dataset.myRoutineListCode,
                            routine_name:e.currentTarget.dataset.routineName,
                            routine_type_a:e.currentTarget.dataset.routineTypeA,
                            routine_type_b:e.currentTarget.dataset.routineTypeB,
                            routine_type_c:e.currentTarget.dataset.routineTypeC,
                            routine_type_d:e.currentTarget.dataset.routineTypeD,
                            routine_record_date:selDate
                        }
                    );
                }else{
                    let index = 0;
                    appendRoutineList.forEach(item=>{
                        if(item.my_routine_list_code === e.currentTarget.dataset.myRoutineListCode){
                            appendRoutineList.splice(index,1);
                            return;
                        }
                        index++;
                    })
                }
            });
            if(".routine-list-input" === flag) break;
        case "All":
        case "#routineAppendBtnOK":
            $('#routineAppendBtnOK').on("click",(e)=>{
                AjaxRequest("dayilRoutineAppend",appendRoutineList);
                rightSideMenuEv(e);
                appendRoutineList = [];
                document.querySelectorAll('.routine-list-checkbox input').forEach((input)=>{
                    input.checked = false;
                })
                let data = {
                    routine_record_date:nowSelectDate()
                }
                AjaxRequest("dailyRoutineMasterRequest",data);
                calendarRendering(resultYear,resultMonth,nowSelectDate().slice(-2),resultDay);
            });
            if("#routineAppendBtnOK" === flag) break;
        case "All":
        case "#modifyOkBtn":
            $("#modifyOkBtn").on("click",(e)=>{
                let selInput = e.currentTarget.parentElement.parentElement.querySelector('input');
                let data= {
                    my_routine_list_code:selInput.dataset.myRoutineListCode,
                    routine_name:selInput.value,
                    routine_type_a:selInput.dataset.routineTypeA,
                    routine_type_b:selInput.dataset.routineTypeB,
                    routine_type_c:selInput.dataset.routineTypeC,
                    routine_type_d:selInput.dataset.routineTypeD
                }
                AjaxRequest("myRoutineNameModify",data);
                AjaxRequest("myRoutineListRequest");
                $('#rightRoutineModifyModal').toggleClass('displayNone');
            });
            if("#modifyOkBtn" === flag) break;
        case "All":
        case ".routine-items-box":
            $('.routine-items-box').on("mousedown",(e)=>{
                eventStartTime = e.timeStamp;
            });
            $('.routine-items-box').on("touchstart",(e)=>{
                eventStartTime = e.timeStamp;
            });
            $('.routine-items-box').on("touchend",(e)=>{
                eventEndTime = e.timeStamp;
                if((eventEndTime-eventStartTime)>800){
                    if($('.modify-img-wrap').data('flag') == 'on'){
                        DeleteMyRoutineList(e);
                    }
                }
            });
            $('.routine-items-box').on("mouseup",(e)=>{
                eventEndTime = e.timeStamp;
                if((eventEndTime-eventStartTime)>800){
                    if($('.modify-img-wrap').data('flag') == 'on'){
                        DeleteMyRoutineList(e);
                    }
                }
            });
            if(".routine-items-box" === flag) break;
        case "All":
        case ".routine-title":
            $('.routine-title').click(function(e){
                routineSelectionEvIn(e);
            });
            if(".routine-title" === flag) break;
        case "All":
        case ".dateBox":
            $('.dateBox').on("click",(e)=>{
                // let data = {
                //     routine_record_date:nowSelectDate()
                // }
                // AjaxRequest("dailyRoutineMasterRequest",data);
            });
            if(".dateBox" === flag) break;
        case "All":
        case ".routine-set-add-btn":
            $('.routine-set-add-btn').click(function(e){
                routineSetAddDOM(e);
                let masterDataDOM = e.currentTarget.parentElement;
                let $routineScoreList = e.currentTarget.parentElement.parentElement;
                let $LastCopyDom = e.currentTarget.parentElement.parentElement.querySelector('.routine-score:last-child');

                let data ={
                    daily_record_master_code:masterDataDOM.dataset.dailyRecordMasterCode,
                    my_routine_list_code:masterDataDOM.dataset.myRoutineListCode,
                    workout_routine_seq:$routineScoreList.querySelector('.routine-score:last-child').dataset.setNum,
                    workout_iterations_count:$LastCopyDom.querySelector('.routine-count span').dataset.count,
                    workout_set_weight:$LastCopyDom.querySelector('.routine-weight span').dataset.weight,
                    workout_done_yn:'N'
                };


                AjaxRequest("InsertRoutineDetail",data);
            });
            if(".routine-set-add-btn" === flag) break;
        case "All":
        case ".item-box":
            // 삭제 이벤트
            $('.item-box').on("mousedown",function(e){
                eventStartTime = e.timeStamp;
                eventStartScreenX = e.screenX;
                eventStartScreenY = e.screenY;
            });
            $('.item-box').on("touchstart",function(e){
                eventStartTime = e.timeStamp;
                eventStartScreenX = e.touches[0].screenX;
                eventStartScreenY = e.touches[0].screenY;
            });
            $('.item-box').on("touchend",function(e){
                eventEndTime = e.timeStamp;


                //터치 이동하면 이벤트 종료
                let currentScreenX = e.changedTouches[0].screenX;
                let currentScreenY = e.changedTouches[0].screenY;
                let screenX = Math.abs(currentScreenX - eventStartScreenX);
                let screenY = Math.abs(currentScreenY - eventStartScreenY);

                console.log("eventStartScreenX : "+ eventStartScreenX + " / currentScreenX : "+currentScreenX);
                console.log("eventStartScreenY : "+ eventStartScreenY + " / currentScreenY : "+currentScreenY);
                console.log("screenX : " + screenX + " / screenY : " + screenY);

                if(screenX > 50 || screenY > 50) return;


                if((eventEndTime-eventStartTime)>800){
                    if(!confirm("선택 루틴을 삭제 할까요?"))return;
                    let routineTitle = e.currentTarget.querySelector('.routine-title');
                    let data ={
                        routine_name: routineTitle.dataset.routineName,
                        routine_record_date: routineTitle.dataset.routineRecordDate,
                        my_routine_list_code:routineTitle.dataset.myRoutineListCode,
                        daily_record_master_code:routineTitle.dataset.dailyRecordMasterCode
                    }
                    AjaxRequest("DeleteRoutineMaster",data);
                }
            });
            $('.item-box').on("mouseup",function(e){
                eventEndTime = e.timeStamp;

                //터치 이동하면 이벤트 종료
                let currentScreenX = e.screenX;
                let currentScreenY = e.screenY;
                let screenX = Math.abs(currentScreenX - eventStartScreenX);
                let screenY = Math.abs(currentScreenY - eventStartScreenY);

                console.log("eventStartScreenX : "+ eventStartScreenX + " / currentScreenX : "+currentScreenX);
                console.log("eventStartScreenY : "+ eventStartScreenY + " / currentScreenY : "+currentScreenY);
                console.log("screenX : " + screenX + " / screenY : " + screenY);

                if(screenX > 50 || screenY > 50) return;

                if((eventEndTime-eventStartTime)>800){
                    if(!confirm("선택 루틴을 삭제 할까요?"))return;
                    let routineTitle = e.currentTarget.querySelector('.routine-title');
                    let data ={
                        routine_name: routineTitle.dataset.routineName,
                        routine_record_date: routineTitle.dataset.routineRecordDate,
                        my_routine_list_code:routineTitle.dataset.myRoutineListCode,
                        daily_record_master_code:routineTitle.dataset.dailyRecordMasterCode
                    }
                    AjaxRequest("DeleteRoutineMaster",data);
                }
            });
            if(".item-box" === flag) break;
        case "All":
        case ".routine-score":
            $('.routine-score').click(function(e){
                let target = e.currentTarget;
                //체크박스에는 이벤트 발동 안되도록
                if(e.target.tagName === 'INPUT' || e.target.tagName === 'I')return;


                $('.routine-set-modify-modal-wrap').toggleClass('displayNone');
                document.querySelector('.routine-set-modify-modal-body-wrap').dataset.dailyRecordMasterCode = e.currentTarget.dataset.dailyRecordMasterCode;

                document.querySelector('.routine-set-modify-modal-body-wrap').dataset.setNum = e.currentTarget.dataset.setNum;
                document.querySelector('.routine-set-modify-modal-body-wrap').dataset.dailyRecordDetailCode = e.currentTarget.dataset.dailyRecordDetailCode;


                document.querySelector('#modifyModalWeight').value = e.currentTarget.querySelector('[data-weight]').dataset.weight;
                document.querySelector('#rangeWeightInput').value = e.currentTarget.querySelector('[data-weight]').dataset.weight;

                document.querySelector('#modifyModalCount').value = e.currentTarget.querySelector('[data-count]').dataset.count;
                document.querySelector('#rangeCountInput').value = e.currentTarget.querySelector('[data-count]').dataset.count;


            });
            if(".routine-score" === flag) break;
        case "All":
        case "[data-workout-done-yn]":
            $('[data-workout-done-yn]').click(function(e){

                let $targetDOM = e.currentTarget.parentElement.parentElement;
                let data ={
                    daily_record_detail_code:$targetDOM.dataset.dailyRecordDetailCode,
                    daily_record_master_code:$targetDOM.dataset.dailyRecordMasterCode,
                    workout_iterations_count:$targetDOM.querySelector('[data-count]').dataset.count,
                    workout_set_weight:$targetDOM.querySelector('[data-weight]').dataset.weight,
                    workout_done_yn:YnConvertFunction(e.currentTarget.checked),

                };
                AjaxRequest('ModifyRoutineDetail',data);

            });
            if("[data-workout-done-yn]" === flag) break;
        case "All":
        case "#routineModifyCancelBtn":
            $('#routineModifyCancelBtn').click(function(e){
                $('.routine-set-modify-modal-wrap').toggleClass('displayNone');
            });
            if("#routineModifyCancelBtn" === flag) break;
        case "All":
        case "#rangeWeightInput":
        case "#rangeCountInput":
            $('#rangeWeightInput').on('input',function(e){
                console.log(e.currentTarget.value);
                $('#modifyModalWeight').val(e.currentTarget.value);
            });
            $('#rangeCountInput').on('input',function(e){
                console.log(e.currentTarget.value);
                $('#modifyModalCount').val(e.currentTarget.value);
            });
            if("#rangeWeightInput" === flag) break;
            if("#rangeCountInput" === flag) break;

        case "All":
        case ".routine-set-modify-modal-img-box": //routine score 팝업 창에서 - , + 버튼 이벤트
            $('.routine-set-modify-modal-img-box').click(function(e){

                console.log('test');
                let imgType = e.currentTarget.dataset.inputType;

                let rangeInput = e.currentTarget.parentElement.querySelector('input');

                let numberInput = e.currentTarget.parentElement.parentElement.querySelector('[type="number"]');

                switch (imgType){
                    case "minus":
                        numberInput.value = numberInput.value -1;
                        rangeInput.value = numberInput.value;
                        break;
                    case "plus":
                        numberInput.value = numberInput.value *1 + 1;
                        rangeInput.value = numberInput.value;
                        break;
                }



            });
            if(".routine-set-modify-modal-img-box" === flag) break;
        case "All":
        case "#routineModifyOkBtn": //routine score 수정 적용 버튼
            $('#routineModifyOkBtn').click(function(e){

                console.log('test');

                let $modifyDom = document.querySelector('.routine-set-modify-modal-body-wrap');
                let data ={
                    daily_record_detail_code:$modifyDom.dataset.dailyRecordDetailCode,
                    daily_record_master_code:$modifyDom.dataset.dailyRecordMasterCode,
                    workout_iterations_count:document.querySelector('#modifyModalCount').value,
                    workout_set_weight:document.querySelector('#modifyModalWeight').value,
                    workout_routine_seq:$modifyDom.dataset.setNum,
                    routine_record_date:nowSelectDate()
                };
                AjaxRequest("ModifyRoutineDetail",data)
                $('.routine-set-modify-modal-wrap').toggleClass('displayNone');
            });
            if("#routineModifyOkBtn" === flag) break;

        case "All":
        case ".routine-delete-btn i": //routine score 수정 적용 버튼
            // 투린 세트 삭제 버튼
            $('.routine-delete-btn i').click(function(e){
                let $scoreDOM = e.currentTarget.parentElement.parentElement;

                if(!confirm("세트 정보를 삭제 하시겠습니까?")) return;
                let data={
                    daily_record_detail_code:$scoreDOM.dataset.dailyRecordDetailCode,
                    daily_record_master_code:$scoreDOM.dataset.dailyRecordMasterCode
                }
                e.currentTarget.parentElement.parentElement.parentElement.parentElement.querySelectorAll('.routine-score-box div').forEach((item)=>{
                    item.remove();
                });
                AjaxRequest("dailyRecordDetailDelete",data);


            });
            if(".routine-delete-btn i" === flag) break;


        case "All":
        case ".right-sidebar": //routine score 수정 적용 버튼
            $('.right-sidebar').click(function(e){
                if(document.querySelector('.right-sidebar') === e.target){
                    rightSideMenuEv(e);
                }
            });
            if(".right-sidebar" === flag) break;
        case "All":
        case ".left-sidebar": //routine score 수정 적용 버튼
            $('.left-sidebar').click(function(e){
                if(document.querySelector('.left-sidebar') === e.target){
                    leftSideMenuEv(e);
                }
            });
            if(".left-sidebar" === flag) break;

    }


}










/* 2. DOM 제어 funtion
 *  - DOM 제어를 수행하는 함수를 작성하는 공간
 */

/**
 * 운동 타입별 이미지 링크
 * @param {String} type workout_type_d
 */
function workoutTypeImageRendering(type){
    let imgSrc;
    switch (type) {
        case "가슴":
            imgSrc = "/img/white-bench-press.png";
            break;
        case "어깨":
            imgSrc = "/img/weight-weight-lifting.png";
            break;
        case "등":
            imgSrc = "/img/white-pull-up.png";
            break;
        case "팔":
            imgSrc = "/img/white-bodybuilder.png";
            break;
        case "코어":
            imgSrc = "/img/white-gym-machine.png";
            break;
        case "하체":
            imgSrc = "/img/weight-power-rack.png";
            break;
    }
    return imgSrc
}

/**
 * 오측 사이드바 렌더링 함수
 * @param Data MyRoutine Model
 */
function rightSidebarDom(Data,flag){
    let imgSrc ="";
    Data.forEach((routine)=>{

        imgSrc = workoutTypeImageRendering(routine.routine_type_d);

        let $routineBox = document.createElement('div');
        $routineBox.classList.add("routine-items-box");

        let $routineItmeImg = document.createElement('div');
        let $routineImg = document.createElement('img');
        $routineImg.setAttribute("src",imgSrc);
        $routineItmeImg.classList.add("routine-item-img");
        $routineItmeImg.append($routineImg);

        let $routineItemName = document.createElement('div');
        $routineItemName.classList.add("routine-item-name");
        let $routineName = document.createElement('span');
        $routineName.setAttribute("name","routineName");
        $routineName.innerText = routine.routine_name;
        $routineItemName.append($routineName);

        let $routineItmeSelBox = document.createElement('div');
        $routineItmeSelBox.classList.add("routine-item-sel-box");
        let $routineCheckBox = document.createElement('div');
        $routineCheckBox.classList.add('form-check','routine-list-checkbox');
        let $routineCheckBoxInput = document.createElement('input');
        $routineCheckBoxInput.type = 'checkbox';
        $routineCheckBoxInput.dataset.myRoutineListCode = routine.my_routine_list_code;
        $routineCheckBoxInput.dataset.routineName = routine.routine_name;
        $routineCheckBoxInput.dataset.routineTypeA = routine.routine_type_a;
        $routineCheckBoxInput.dataset.routineTypeB = routine.routine_type_b;
        $routineCheckBoxInput.dataset.routineTypeC = routine.routine_type_c;
        $routineCheckBoxInput.dataset.routineTypeD = routine.routine_type_d;
        $routineCheckBoxInput.dataset.flag = routine.flag;
        $routineCheckBoxInput.classList.add('form-check-input','login-checkbox','routine-list-input');
        let $routineModifyBtnBox = document.createElement('div');
        $routineModifyBtnBox.classList.add("routine-modify-btn-box","displayNone");
        let $okBtn = document.createElement('button');
        $okBtn.classList.add("routine-modify-btn");
        let $okBtnImg = document.createElement('img');
        $okBtnImg.setAttribute("src","/img/C992F4-edit.png");
        $okBtn.append($okBtnImg);
        $routineModifyBtnBox.append($okBtn);
        $routineCheckBox.append($routineCheckBoxInput);
        $routineItmeSelBox.append($routineCheckBox);
        $routineItmeSelBox.append($routineModifyBtnBox);

        $routineBox.append($routineItmeImg,$routineItemName,$routineItmeSelBox);


        document.querySelector('.routine-list-box[data-type-d="'+routine.routine_type_d+'"]').querySelector('.routine-items-wrap').appendChild($routineBox);
        if(flag==='add'){
            $('.routine-list-box[data-type-d="'+routine.routine_type_d+'"] .routine-items-wrap .routine-items-box:last .routine-item-sel-box div').toggleClass("displayNone");
        }
    })
    pageElementEventAdd(".routine-modify-btn");
    pageElementEventAdd('.routine-list-input');
    pageElementEventAdd('#modifyOkBtn');
    // pageElementEventAdd(".routine-items-box");

}

/**
 * 루틴 삭제하는 함수
 * @param e
 * @constructor
 */
function DeleteMyRoutineList(e){
    eventStartTime=0;
    eventEndTime=0;
    if(!confirm("루틴을 삭제 할까요?")){
        return;
    }else{
        e.currentTarget.remove();
        let selInput = e.currentTarget.querySelector('input');
        let data= {
            my_routine_list_code:selInput.dataset.myRoutineListCode,
            routine_name:selInput.dataset.routineName,
            routine_type_a:selInput.dataset.routineTypeA,
            routine_type_b:selInput.dataset.routineTypeB,
            routine_type_c:selInput.dataset.routineTypeC,
            routine_type_d:selInput.dataset.routineTypeD
        }
        AjaxRequest("myRoutineListDelete",data);
    }
}

/**
 * routine score를 담을 수 있는 DOM 랜더링 함수
 * @param data
 */
function workoutRoutineBoxDOM(data){

    if(null !== document.querySelector('.item-wrap'))    document.querySelector('.item-wrap').remove();

    let $sendDom = document.createElement('div');
    $sendDom.classList.add('item-wrap');
    data.forEach((routine)=>{
        let $itemBox = document.createElement('div');
        $itemBox.classList.add("item-box");
        let $routineTitle = document.createElement('div');
        $routineTitle.classList.add("routine-title");
        $routineTitle.dataset.dailyRecordMasterCode = routine.daily_record_master_code;
        $routineTitle.dataset.routineName = routine.routine_name;
        $routineTitle.dataset.routineName = routine.routine_name;
        $routineTitle.dataset.routineRecordDate = routine.routine_record_date;
        $routineTitle.dataset.myRoutineListCode = routine.my_routine_list_code;

        let $routineIcon = document.createElement('div');
        $routineIcon.classList.add("routine-icon");
        let $routineIconImg = document.createElement('img');

        let imgSrc = workoutTypeImageRendering(routine.routine_type_d);
        $routineIconImg.setAttribute('src',imgSrc);
        $routineIcon.append($routineIconImg);

        let $routineName = document.createElement('div');
        $routineName.classList.add('routine-name');
        let $routineNameSpan = document.createElement('span');
        $routineNameSpan.textContent = routine.routine_name;
        $routineName.append($routineNameSpan);

        let $routineArrow = document.createElement('div');
        $routineArrow.classList.add("routine-arrow");
        let $routineArrowImg = document.createElement('img');
        $routineArrowImg.setAttribute('src','/img/arrow_down.png');
        $routineArrow.append($routineArrowImg);

        $routineTitle.append($routineIcon);
        $routineTitle.append($routineName);
        $routineTitle.append($routineArrow);
        $itemBox.append($routineTitle);
// -----------------title END

        let $routineItemBox = document.createElement('div');
        $routineItemBox.classList.add('routine-item-box');
        $routineItemBox.classList.add('displayNone');
        let $routineScoreBox = document.createElement('div');
        $routineScoreBox.classList.add('routine-score-box');

        routine.daily_record_detail_list.forEach((detailItem)=>{
            let $routineScore = document.createElement('div');

            $routineScore.classList.add('routine-score');
            $routineScore.dataset.dailyRecordMasterCode = detailItem.daily_record_master_code;
            $routineScore.dataset.setNum = detailItem.workout_routine_seq;
            $routineScore.dataset.dailyRecordDetailCode = detailItem.daily_record_detail_code;


            let $routineDoneChekchbox = document.createElement('div');
            $routineDoneChekchbox.classList.add('routine-done-checkbox');
            $routineDoneChekchbox.classList.add('form-check');
            $routineDoneChekchbox.classList.add('info-status');
            let $routineFormCheckInput = document.createElement('input');
            $routineFormCheckInput.checked = YnConvertFunction(detailItem.workout_done_yn);
            $routineFormCheckInput.type='checkbox';
            $routineFormCheckInput.classList.add('form-check-input');
            $routineFormCheckInput.classList.add('login-checkbox');
            $routineFormCheckInput.dataset.workoutDoneYn = detailItem.workout_done_yn;
            $routineDoneChekchbox.append($routineFormCheckInput);
            $routineScore.append($routineDoneChekchbox);

            let $routineSetNum = document.createElement('div');
            $routineSetNum.classList.add('routine-set-num');
            let $routineSetNumSpan = document.createElement('span');
            $routineSetNumSpan.dataset.setNum = detailItem.workout_routine_seq;
            $routineSetNumSpan.textContent = detailItem.workout_routine_seq;
            $routineSetNum.append($routineSetNumSpan);
            $routineSetNum.append("세트");


            let $routineWeight = document.createElement('div');
            $routineWeight.classList.add('routine-weight');
            let $routineWeightSpan = document.createElement('span');
            $routineWeightSpan.dataset.weight = detailItem.workout_set_weight;
            $routineWeightSpan.textContent = detailItem.workout_set_weight;
            $routineWeight.append($routineWeightSpan);
            $routineWeight.append(" Kg");


            let $routineCount = document.createElement('div');
            $routineCount.classList.add('routine-count');
            let $routineCountSpan = document.createElement('span');
            $routineCountSpan.dataset.count = detailItem.workout_iterations_count;
            $routineCountSpan.textContent = detailItem.workout_iterations_count;
            $routineCount.append($routineCountSpan);
            $routineCount.append(" 회");

            let $routineDeleteBtn = document.createElement('div');
            $routineDeleteBtn.classList.add('routine-delete-btn');
            let $routineDeleteBtnI = document.createElement('i');
            $routineDeleteBtnI.classList.add('bi');
            $routineDeleteBtnI.classList.add('bi-trash');
            $routineDeleteBtn.append($routineDeleteBtnI);

            $routineScore.append($routineSetNum);
            $routineScore.append($routineWeight);
            $routineScore.append($routineCount);
            $routineScore.append($routineDeleteBtn);

            //routine-score END
            $routineScoreBox.append($routineScore);
        })


        $routineItemBox.append($routineScoreBox);



        let $routineAddBtnBox = document.createElement('div');
        $routineAddBtnBox.classList.add('routine-add-btn');
        $routineAddBtnBox.dataset.myRoutineListCode = routine.my_routine_list_code;
        $routineAddBtnBox.dataset.dailyRecordMasterCode = routine.daily_record_master_code;
        let $routineAddBtn = document.createElement('button');
        $routineAddBtn.classList.add('routine-set-add-btn');
        $routineAddBtn.type='button';
        $routineAddBtn.textContent = 'Add+';
        $routineAddBtnBox.append($routineAddBtn);
        $routineItemBox.append($routineAddBtnBox);


        $itemBox.append($routineItemBox);

        //마지막 wrap DOM
        $sendDom.append($itemBox);
    });
    document.querySelector('#dailyRecordWrap').append($sendDom);
    pageElementEventAdd('.routine-title');
    pageElementEventAdd('.item-box');
    pageElementEventAdd('.routine-score-box');
    pageElementEventAdd('.routine-score');
    pageElementEventAdd('.routine-delete-btn i');
    pageElementEventAdd('[data-workout-done-yn]');
}


/**
 * routine 세트 단위 DOM 랜더링 함수
 * @param e
 */
function routineSetAddDOM(e){
    if(e.currentTarget.parentElement.parentElement.querySelectorAll(".routine-score:last-child").length === 0){

        let $routineTitleDOM = e.currentTarget.parentElement.parentElement.parentElement.querySelector('.routine-title');



        let $routineScore = document.createElement('div');
        $routineScore.classList.add('routine-score');
        $routineScore.dataset.dailyRecordMasterCode = $routineTitleDOM.dataset.dailyRecordMasterCode;
        $routineScore.dataset.setNum = 1;

        let $routineDoneChekchbox = document.createElement('div');
        $routineDoneChekchbox.classList.add('routine-done-checkbox');
        $routineDoneChekchbox.classList.add('form-check');
        $routineDoneChekchbox.classList.add('info-status');
        let $routineFormCheckInput = document.createElement('input');
        $routineFormCheckInput.type='checkbox';
        $routineFormCheckInput.classList.add('form-check-input');
        $routineFormCheckInput.classList.add('login-checkbox');
        $routineFormCheckInput.dataset.workoutDoneYn = 'N';

        $routineDoneChekchbox.append($routineFormCheckInput);
        $routineScore.append($routineDoneChekchbox);

        let $routineSetNum = document.createElement('div');
        $routineSetNum.classList.add('routine-set-num');
        let $routineSetNumSpan = document.createElement('span');
        $routineSetNumSpan.dataset.setNum = 1;
        $routineSetNumSpan.textContent = 1;
        $routineSetNum.append($routineSetNumSpan);
        $routineSetNum.append("세트");


        let $routineWeight = document.createElement('div');
        $routineWeight.classList.add('routine-weight');
        let $routineWeightSpan = document.createElement('span');
        $routineWeightSpan.dataset.weight = 0;
        $routineWeightSpan.textContent = 0;
        $routineWeight.append($routineWeightSpan);
        $routineWeight.append(" Kg");


        let $routineCount = document.createElement('div');
        $routineCount.classList.add('routine-count');
        let $routineCountSpan = document.createElement('span');
        $routineCountSpan.dataset.count = 0;
        $routineCountSpan.textContent = 0;
        $routineCount.append($routineCountSpan);
        $routineCount.append(" 회");

        let $routineDeleteBtn = document.createElement('div');
        $routineDeleteBtn.classList.add('routine-delete-btn');
        let $routineDeleteBtnI = document.createElement('i');
        $routineDeleteBtnI.classList.add('bi');
        $routineDeleteBtnI.classList.add('bi-trash');
        $routineDeleteBtn.append($routineDeleteBtnI);

        $routineScore.append($routineSetNum);
        $routineScore.append($routineWeight);
        $routineScore.append($routineCount);
        $routineScore.append($routineDeleteBtn);
        e.currentTarget.parentElement.parentElement.querySelector('.routine-score-box').appendChild($routineScore);

        pageElementEventAdd('.routine-score');
        pageElementEventAdd('.routine-delete-btn i');
        pageElementEventAdd('[data-workout-done-yn]');
        return;
    }
    let $domBox = e.currentTarget.parentElement.parentElement;
    let $scoreDom = e.currentTarget.parentElement.parentElement.querySelector(".routine-score:last-child").cloneNode(true);
    $scoreDom.querySelector('input[type="checkbox"]').checked = false;
    let setNum = $scoreDom.querySelector('.routine-set-num span').innerText * 1 +1;
    let weight = $scoreDom.querySelector('.routine-weight span').innerText * 1;
    let count = $scoreDom.querySelector('.routine-count span').innerText * 1;
    $scoreDom.querySelector('.routine-set-num span').innerText = setNum;

    $scoreDom.dataset.setNum = setNum;

    e.currentTarget.parentElement.parentElement.querySelector('.routine-score-box').appendChild($scoreDom);
    pageElementEventAdd('.routine-score');
    pageElementEventAdd('.routine-delete-btn i');
    pageElementEventAdd('[data-workout-done-yn]');
}


/**
 * routine score DOM 제어 함수
 * @param data
 */
function routineScoreBoxRan(data){

    let $routineScore = document.createElement('div');
    $routineScore.classList.add('routine-score');
    $routineScore.dataset.dailyRecordMasterCode = data.daily_record_master_code;
    $routineScore.dataset.dailyRecordDetailCode = data.daily_record_detail_code;
    $routineScore.dataset.setNum = data.workout_routine_seq;

    let $routineDoneChekchbox = document.createElement('div');
    $routineDoneChekchbox.classList.add('routine-done-checkbox');
    $routineDoneChekchbox.classList.add('form-check');
    $routineDoneChekchbox.classList.add('info-status');
    let $routineFormCheckInput = document.createElement('input');
    $routineFormCheckInput.type='checkbox';
    $routineFormCheckInput.classList.add('form-check-input');
    $routineFormCheckInput.classList.add('login-checkbox');
    $routineFormCheckInput.dataset.workoutDoneYn = data.workout_done_yn;
    $routineFormCheckInput.checked = YnConvertFunction(data.workout_done_yn);
    $routineDoneChekchbox.append($routineFormCheckInput);
    $routineScore.append($routineDoneChekchbox);

    let $routineSetNum = document.createElement('div');
    $routineSetNum.classList.add('routine-set-num');
    let $routineSetNumSpan = document.createElement('span');
    $routineSetNumSpan.dataset.setNum = data.workout_routine_seq;
    $routineSetNumSpan.textContent = data.workout_routine_seq;
    $routineSetNum.append($routineSetNumSpan);
    $routineSetNum.append("세트");


    let $routineWeight = document.createElement('div');
    $routineWeight.classList.add('routine-weight');
    let $routineWeightSpan = document.createElement('span');
    $routineWeightSpan.dataset.weight = data.workout_set_weight;
    $routineWeightSpan.textContent = data.workout_set_weight;
    $routineWeight.append($routineWeightSpan);
    $routineWeight.append(" Kg");


    let $routineCount = document.createElement('div');
    $routineCount.classList.add('routine-count');
    let $routineCountSpan = document.createElement('span');
    $routineCountSpan.dataset.count = data.workout_iterations_count;
    $routineCountSpan.textContent = data.workout_iterations_count;
    $routineCount.append($routineCountSpan);
    $routineCount.append(" 회");

    let $routineDeleteBtn = document.createElement('div');
    $routineDeleteBtn.classList.add('routine-delete-btn');
    let $routineDeleteBtnI = document.createElement('i');
    $routineDeleteBtnI.classList.add('bi');
    $routineDeleteBtnI.classList.add('bi-trash');
    $routineDeleteBtn.append($routineDeleteBtnI);

    $routineScore.append($routineSetNum);
    $routineScore.append($routineWeight);
    $routineScore.append($routineCount);
    $routineScore.append($routineDeleteBtn);


    let targetTitleBox = document.querySelector('.routine-title[data-daily-record-master-code="'+data.daily_record_master_code+'"]');
    targetTitleBox.parentElement.querySelector('.routine-score-box').appendChild($routineScore);


    pageElementEventAdd('.routine-score');
    pageElementEventAdd('.routine-delete-btn i');
    pageElementEventAdd('[data-workout-done-yn]');
}
/* 3. 데이터 연산 function
 *  - 데이터에 대한 보정이 필요함 함수 작성하는 공간
 */




/*
 * 4. AJAX 처리 function
 * - 호출할 ajax 타입 명 (string)
 */
function AjaxRequest(type,data,flag){
    switch(type){
        // case "selDateRoutineRequest":
        //     console.log("AJAX : selDateRoutineRequest을 수행합니다");
        //     break;
        case "myRoutineListRequest":
            console.log("myRoutineListRequest : Ajax Request !!");
            $.ajax({
                url:'/api/app1/getMyRoutineList',
                type:'post',
                async: false,
                contentType:"application/json;charset=UTF-8",
                success:function(res){
                    $('.routine-items-box').remove();
                    rightSidebarDom(res);
                    $('.routine-list-checkbox').toggleClass("displayNone");
                    $('.routine-modify-btn-box').toggleClass("displayNone");
                }
            });
            break;
        case "dayilRoutineAppend":
            console.log("dayilRoutineAppend : Ajax Request !!");
            $.ajax({
                url:'/api/app1/dayilRoutineAppend',
                type:'post',
                contentType:"application/json;charset=UTF-8",
                dataType:"text",
                async: false,
                data:JSON.stringify(data),
                success:function(res){
                    console.log(res);
                }
            });
            break;
        case "myRoutineListAdd":
            console.log("myRoutineListAdd : Ajax Request !!");

            $.ajax({
                url:'/api/app1/InsertMyRoutine',
                type:'post',
                contentType:"application/json;charset=UTF-8",
                dataType:"text",
                async: false,
                data:JSON.stringify(data[0]),
                success:function(res){
                    console.log(res);
                }
            });

            break;
        case "myRoutineNameModify":
            console.log("myRoutineNameModify : Ajax Request !!");
            $.ajax({
                url:'/api/app1/ModifyMyRoutine',
                type:'post',
                contentType:"application/json;charset=UTF-8",
                dataType:"text",
                async: false,
                data:JSON.stringify(data),
                success:function(res){
                    console.log(res);
                }
            });
            break;
        case "myRoutineListDelete":
            console.log("myRoutineListDelete : Ajax Request !!");
            $.ajax({
                url:'/api/app1/DeleteMyRoutine',
                type:'post',
                contentType:"application/json;charset=UTF-8",
                dataType:"text",
                async: false,
                data:JSON.stringify(data),
                success:function(res){
                    console.log(res);
                }
            });
            break;
        case "dailyRoutineMasterRequest":
            console.log("dailyRoutineMasterRequest : Ajax Request !!");

            $.ajax({
                url:'/api/app1/dailyRoutineMasterRequest',
                type:'post',
                contentType:"application/json;charset=UTF-8",
                dataType:"json",
                async: false,
                data:JSON.stringify(data),
                success:function(res){
                    console.log(res);
                    workoutRoutineBoxDOM(res);
                    pageElementEventAdd('.routine-set-add-btn');
                    if(res.length === 0){
                        $('.selectedDate .attendance-line').text("");
                        $('.selectedDate .attendance-line').toggleClass('attendance-line');

                    }
                }
            });
            break;
        case "DeleteRoutineMaster":
            console.log("dailyRoutineMasterRequest : Ajax Request !!");

            $.ajax({
                url:'/api/app1/DeleteRoutineMaster',
                type:'post',
                contentType:"application/json;charset=UTF-8",
                dataType:"text",
                async: false,
                data:JSON.stringify(data),
                success:function(res){
                    console.log(res);
                    let data = {
                        routine_record_date:nowSelectDate()
                    }
                    AjaxRequest("dailyRoutineMasterRequest",data);
                }
            });
            break;
        case "InsertRoutineDetail":
            console.log("InsertRoutineDetail : Ajax Request !!");

            $.ajax({
                url:'/api/app1/InsertRoutineDetail',
                type:'post',
                contentType:"application/json;charset=UTF-8",
                dataType:"json",
                async: false,
                data:JSON.stringify(data),
                success:function(res){
                    let $routineScoreDOM = document.querySelector('.routine-title[data-daily-record-master-code="'+res.daily_record_master_code+'"]').parentElement.querySelector('.routine-score:last-child');
                    $routineScoreDOM.dataset.dailyRecordDetailCode = res.daily_record_detail_code;
                }
            });
            break;
        case "DeleteRoutineDetail":
            console.log("DeleteRoutineDetail : Ajax Request !!");

            $.ajax({
                url:'/api/app1/DeleteRoutineDetail',
                type:'post',
                contentType:"application/json;charset=UTF-8",
                dataType:"text",
                async: false,
                data:JSON.stringify(data),
                success:function(res){
                    console.log(res);
                    let data = {
                        routine_record_date:nowSelectDate()
                    }
                    AjaxRequest("dailyRoutineMasterRequest",data);
                }
            });
            break;
        case "ModifyRoutineDetail":
            console.log("ModifyRoutineDetail : Ajax Request !!");

            $.ajax({
                url:'/api/app1/ModifyRoutineDetail',
                type:'post',
                contentType:"application/json;charset=UTF-8",
                dataType:"json",
                async: false,
                data:JSON.stringify(data),
                success:function(res){
                    let $routineScoreDOM = document.querySelector('.routine-score[data-daily-record-detail-code="'+res.daily_record_detail_code+'"]');
                    $routineScoreDOM.dataset.setNum = res.workout_routine_seq;
                    $routineScoreDOM.dataset.workoutSetWeight = res.workout_set_weight;
                    $routineScoreDOM.dataset.workoutIterationsCount = res.workout_iterations_count;
                    $routineScoreDOM.querySelector('.routine-weight span').dataset.weight = res.workout_set_weight;
                    $routineScoreDOM.querySelector('.routine-weight span').innerText = res.workout_set_weight;

                    $routineScoreDOM.querySelector('.routine-count span').dataset.count = res.workout_iterations_count;
                    $routineScoreDOM.querySelector('.routine-count span').innerText = res.workout_iterations_count;


                    console.log(res);

                }
            });
            break;




        case "dailyRecordDetailDelete":
            console.log("dailyRecordDetailDelete : Ajax Request !!");
            $.ajax({
                url:'/api/app1/dailyRecordDetailDelete',
                type:'post',
                contentType:"application/json;charset=UTF-8",
                dataType:"json",
                async: false,
                data:JSON.stringify(data),
                success:function(res){
                    res.forEach((detail)=>{
                        routineScoreBoxRan(detail);
                    })


                }
            });

            break;
        case "calendarLineRequest":
            console.log("calendarLineRequest : Ajax Request !!");


            break;

    }
}


/* 5. 기타 function
 *  - 기타 함수를 정의하는 공간
 */
const debounce = (callback, delay) => {
    let timer;
    return (event) => {
        // 실행 중인 타이머가 있다면, 제거 후 재생성
        if (timer)clearTimeout(timer);
        timer = setTimeout(callback, delay, event);
    };
};

/**
 * Y / N 을 boolean 값으로 변환하는 함수
 * @param {String } flag (Y or N) ('true' or 'false')
 * @returns {boolean}
 */
function YnConvertFunction(flag){
    switch (flag){
        case "Y":
        case "N":
            return flag === 'Y'?true:false;
        case "true":
        case "false":
            return flag === 'true'?true:false;
        case true:
        case false:
            return flag ? "Y":"N";
    }
}

function nowSelectDate(){
    if(null === document.querySelector('.selectedDate .dateLabel')){
        alert("날짜를 먼저 선택해 주세요.");
        return;
    }
    let selYear = document.querySelector('#dateSaveBox').dataset.calendarYear;
    let selMonth = document.querySelector('#dateSaveBox').dataset.calendarMonth * 1 + 1;
    if(selMonth < 10){
        selMonth = "0"+selMonth
    }
    let selDate = document.querySelector('.selectedDate .dateLabel').dataset.value;
    if(selDate < 10){
        selDate = "0"+selDate
    }
    console.log("선택 날짜 : "+selYear+"-"+selMonth+"-"+selDate);
    return selYear+"-"+selMonth+"-"+selDate;
}
