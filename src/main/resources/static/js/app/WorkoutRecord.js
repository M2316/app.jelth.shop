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
    pageElementEventAdd("All");
    AjaxRequest("myRoutineListRequest"); //우측 사이드바에 routine목록 로딩

    setTimeout((e)=>{
        $('.routine-list-checkbox').toggleClass("displayNone");
        $('.routine-modify-btn-box').toggleClass("displayNone");
    },500)
    let data = {
        routine_record_date:nowSelectDate()
    }
    AjaxRequest("dailyRoutineMasterRequest",data);
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

        //case "All":
        case ".dateBox":
            $(".dateBox").on("click",debounce((e)=>{
                AjaxRequest("selDateRoutineRequest");
            }, 300));
            if(flag === ".dateBox") break;

        case "All":
        case "#routineAppendBtn":
            $("#routineAppendBtn").click((e)=>{

            });
            if(flag === "#routineAppendBtn") break;
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
                        if(item.routineName === e.currentTarget.dataset.routineName){
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
            if(".routine-items-box" === flag) break;
        case "All":
        case ".dateBox":
            $('.dateBox').on("click",(e)=>{
                // let data = {
                //     routine_record_date:nowSelectDate()
                // }
                // AjaxRequest("dailyRoutineMasterRequest",data);
            });
            if(".routine-items-box" === flag) break;
        case "All":
        case ".item-box":
            // 삭제 이벤트
            $('.item-box').on("mousedown",function(e){
                eventStartTime = e.timeStamp;
            });
            $('.item-box').on("touchstart",function(e){
                eventStartTime = e.timeStamp;
            });
            $('.item-box').on("touchend",function(e){
                eventEndTime = e.timeStamp;
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

    }


}











/* 2. DOM 제어 funtion
 *  - DOM 제어를 수행하는 함수를 작성하는 공간
 */

/**
 * 오측 사이드바 렌더링 함수
 * @param Data MyRoutine Model
 */
function rightSidebarDom(Data,flag){
    Data.forEach((routine)=>{

        let imgSrc;
        switch (routine.routine_type_d){
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
    pageElementEventAdd(".routine-items-box");

}
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
        $routineIconImg.setAttribute('src','/img/white-bench-press.png');
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


        for(let i=0; i<2; i++){
            let $routineScore = document.createElement('div');
            $routineScore.classList.add('routine-score');

            let $routineDoneChekchbox = document.createElement('div');
            $routineDoneChekchbox.classList.add('routine-done-checkbox');
            $routineDoneChekchbox.classList.add('form-check');
            $routineDoneChekchbox.classList.add('info-status');
            let $routineFormCheckInput = document.createElement('input');
            $routineFormCheckInput.type='checkbox';
            $routineFormCheckInput.classList.add('form-check-input');
            $routineFormCheckInput.classList.add('login-checkbox');
            $routineFormCheckInput.id = 'workoutDoneYn';
            $routineDoneChekchbox.append($routineFormCheckInput);
            $routineScore.append($routineDoneChekchbox);

            let $routineSetNum = document.createElement('div');
            $routineSetNum.classList.add('routine-set-num');
            let $routineSetNumSpan = document.createElement('span');
            $routineSetNumSpan.dataset.setNum = i;
            $routineSetNumSpan.textContent = i+1;
            $routineSetNum.append($routineSetNumSpan);
            $routineSetNum.append("세트");


            let $routineWeight = document.createElement('div');
            $routineWeight.classList.add('routine-weight');
            let $routineWeightSpan = document.createElement('span');
            $routineWeightSpan.dataset.weight = 100;
            $routineWeight.append($routineWeightSpan);
            $routineWeight.append("Kg");


            let $routineCount = document.createElement('div');
            $routineCount.classList.add('routine-count');
            let $routineCountSpan = document.createElement('span');
            $routineCountSpan.dataset.count = 10;
            $routineCount.append($routineCountSpan);
            $routineCount.append("회");

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
        }


        $routineItemBox.append($routineScoreBox);



        let $routineAddBtnBox = document.createElement('div');
        $routineAddBtnBox.classList.add('routine-add-btn');
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
        case "selDateRoutineRequest":
            console.log("AJAX : selDateRoutineRequest을 수행합니다");
            break;
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