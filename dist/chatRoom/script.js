//启用高刷新率组件
text_input();
$("#sendtext").height(0);
$('#sendtext').scrollTop(0);
$("#sendtext").height(document.getElementById('sendtext').scrollHeight);
$('#sendtext').val()?$('#sendgo').text("发送"):$('#sendgo').text("刷新");
$('#sendremain').text(300 - $('#sendtext').val().length)
// 初始化变量
marked.setOptions({breaks: true});//基本设置
AV.init({appId:"appId",appKey:"appKey",serverURL:"serverURL"});
const month_con={Jan:'01',Feb:'02',Mar:'03',Apr:'04',May:'05',Jun:'06',Jul:'07',Aug:'08',Sep:'09',Oct:'10',Nov:'11',Dec:'12'};
var scroll_bool=false,skip_num=0,scroll_used=0;
//自动登录
const currentUser = AV.User.current();
if(currentUser){
    var objectId=currentUser.id;
    $('#username').text(currentUser.get('username'));
    $('#userHead').attr('src',currentUser.get('img'));
    $('#userLevel').attr('src',`img/lv${currentUser.get('level')}.svg`);
    $('.user').attr('onclick','userset_show()');
}
chat_get();
//函数
function userset_show(){
    if($('#userset').css('display')=='none'){
        $('#userset').show();
    }else{
        $('#userset').hide();
    }
}
function login_show(){
    if($('.login').css('display')=='none'){
        $('.login').show();
        $('#username').text('关闭');
    }else{
        $('.login').hide();
        $('#username').text('登录');
    }
}
function login_go(){
    if($('#loginname').val()&&$('#loginpassword').val()){
        AV.User.logIn($('#loginname').val(),$('#loginpassword').val()).then((response) => {
            location.reload();
        }, (error) => {
            alert(`登陆失败 [${error.code}]\n${error.rawMessage}`);
        });
    }else{
        alert("输入内容缺失")
    }
}
function text_input(){
    $("#sendtext").height(0);
    $('#sendtext').scrollTop(0);
    $("#sendtext").height(document.getElementById('sendtext').scrollHeight);
    $('#sendtext').val()?$('#sendgo').text("发送"):$('#sendgo').text("刷新");
    $('#sendremain').text(300 - $('#sendtext').val().length)
}
function text_send() {
    if($("#sendtext").val()){
        if (currentUser) {
            $('#sendgo').css('background-color','#222');
            $('#sendgo').attr('onclick','');
            var text=JSON.stringify({app:'chat',type:'mainSend',id:currentUser.id,token:currentUser.getSessionToken(),content:$("#sendtext").val()});
            $.post('backendURL',text,function(callback){
                $('#sendgo').css('background-color','#1661ab');
                $('#sendgo').attr('onclick','text_send()');
                if(callback=='finish'){
                    $("#sendtext").val("");
                    $('#sendgo').text("刷新");
                    chat_get();
                }else{
                    console.log(callback);
                }
            });
        }else{
            login_show();
        }
    }else{
        chat_get();
    }
}
function chat_get(skip=0) {
    scroll_bool=false;
    if(!skip){skip_num=0;scroll_used=0;$('.content').empty();}
    $('.loading').show();
    const query = new AV.Query('main');
    query.descending('createdAt');
    query.limit(20);
    query.skip(skip);
    query.find().then((response) => {
        var inner='',creat_time='';
        for (var i=0,len=response.length;i<len;i++) {
            creat_time = (response[i].createdAt+'').split(" ");
            creat_time = `${creat_time[3]}-${month_con[creat_time[1]]}-${creat_time[2]} ${creat_time[4]}`;
            inner+=`<div class="cell"><div class="info"><img src="${$('<p>').text(response[i].get('img')).html()}"><p>${$('<p>').text(response[i].get('name')).html()}</p><img src="img/lv${response[i].get('level')}.svg"><p>${creat_time}</p><p update="2020-01-01 23:59:46"></p></div><div class="message">${marked.parse($('<p>').text(response[i].get('content')).html())}</div></div>`;
        }
        scroll_used=$('.content').height();
        $('.content').append(inner);
        $('.loading').hide();
        console.log($('.content').height());
        $('main').scrollTop($('.content').height()-scroll_used);
        scroll_bool=true;        
    });
}

$("main").scroll(function() {
    if(scroll_bool&&$("main").scrollTop()==0){
        scroll_bool=false;
        skip_num+=20;
        chat_get(skip_num);
    }
});