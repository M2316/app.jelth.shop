
$(function(){
    $('#userLoginBtn').click(function(e){
        // document.body.webkitRequestFullscreen();
        const uIdFlag = document.querySelector("#userLoginForm [name='uId']").value.length === 0;
        const uPwFlag = document.querySelector("#userLoginForm [name='uPw']").value.length === 0;
        if(uPwFlag &&uPwFlag){
            alert("아이디 또는 비밀번호를 확인해 주세요.");
            return;
        }else{
            $('#userLoginForm').submit();
        }
    });

});
