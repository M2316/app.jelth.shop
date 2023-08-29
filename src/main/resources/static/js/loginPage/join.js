$(function(){

    $("#uId").change(function(e){
        let memberId = e.currentTarget.value;
        var reg = /^[a-z0-9]+[0-9a-z]{5,19}$/g;

        if(!reg.test(memberId)){
            alert("영문과 숫자만 사용해 주세요");
            return;
        }



        $.ajax({
            url:'/memberIdCheck',
            data:memberId,
            type:'post',
            contentType:"application/json;charset=UTF-8",
            success:function(res){
                if(res === "OK"){
                    $('#uIdFlag').text("Check!");
                    $('#uIdFlag').data('Flag','OK');
                    $('#uIdFlag').css('color','blue');
                }else if(res === "NO"){
                    $('#uIdFlag').text("이미 사용중인 아이디입니다.");
                    $('#uIdFlag').data('Flag','NO');
                    $('#uIdFlag').css('color','red');
                }
                return;
            }
        });

    });
    $("#uPw").change(function(e){
        let reg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/
        let memberPw = e.currentTarget.value;
        if(!reg.test(memberPw)){
            $('#uPwFlag').text("비밀번호 규칙과 맞지 않습니다.");
            $("#uPwFlag").data('Flag','NO');
            $('#uPwFlag').css('color','red');
            return ;
        }
        $('#uPwFlag').text("Check!");
        $("#uPwFlag").data('Flag','OK');
        $('#uPwFlag').css('color','blue');
    });

    $("#uPwCheck").change(function(e){
        let memberPw = e.currentTarget.value;

        if($("#uPw").val() !== memberPw){
            $('#uPwCheckFlag').text("비밀번호가 다릅니다.");
            $("#uPwCheckFlag").data('Flag','NO');
            $('#uPwCheckFlag').css('color','red');
            return ;
        }
        $('#uPwCheckFlag').text("Check!");
        $("#uPwCheckFlag").data('Flag','OK');
        $('#uPwCheckFlag').css('color','blue');
    });
    $("#uName").change(function(e){
        let memberPw = e.currentTarget.value;

        if(memberPw.length === 0){
            $('#uNameFlag').text("이름은 필수 항목입니다.");
            $("#uNameFlag").data('Flag','NO');
            $('#uNameFlag').css('color','red');
            return ;
        }
        $('#uNameFlag').text("Check!");
        $("#uNameFlag").data('Flag','OK');
        $('#uNameFlag').css('color','blue');
    });

    $('#userJoinFormBtn').click(function(e){
        if($('#uIdFlag').data("Flag") !== 'OK'){
            alert("아이디가 유요하지 않습니다. 아이디를 확인해 주세요.");
            return;
        }
        if($('#uPwFlag').data("Flag") !== 'OK'){
            alert("비밀번호가 유요하지 않습니다. 비밀번호를 확인해 주세요.");
            return;
        }
        if($('#uPwCheckFlag').data("Flag") !== 'OK'){
            alert("비밀번호 확인이 유요하지 않습니다. 비밀번호 확인을 확인해 주세요.");
            return;
        }
        if($('#uNameFlag').data("Flag") !== 'OK'){
            alert("이름이 유요하지 않습니다. 이름을 확인해 주세요.");
            return;
        }
        $('#userJoinForm').submit();
    });


});