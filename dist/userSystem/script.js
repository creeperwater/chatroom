var date = new Date();
$('body').css('background-image',`url('bgImageURL/${date.getMonth()+1}.jpg')`);
winHome();
var url_list=location.search.substring(1).split('&'),url_obj={};
for(var i=0,len=url_list.length;i<len;i++){
  url_obj[url_list[i].split('=')[0]]=url_list[i].split('=')[1];
}
console.log(url_obj)
function winNote(content){
  $('#note').text(content);
  $('#note').fadeIn()
  setTimeout(function(){$('#note').fadeOut()},3000);
}
function winHome(){
  $('section').hide();
  $('#note').hide();
  $('#home').hide();
  $('#face').fadeIn();
}
function winSignup(){
  $('#face').hide();
  $('#signup').fadeIn();
  $('#home').fadeIn();
}
function winLogin(){
  $('#face').hide();
  $('#login').fadeIn();
}
function winReset(){
  $('#login').hide();
  $('#reset').fadeIn();
}
function goSignup(){
  const form={un:$('#signup-username').val(),pw:$('#signup-password').val(),em:$('#signup-email').val(),pw2:$('#signup-password2').val()};
  if(form.un.length>10||form.un.length<1){
    winNote('用户名长度错误');
  }else if(form.pw.length>20||form.pw.length<5){
    winNote('密码长度错误');
  }else if(form.em.split('@')[1]!='qq.com'&&form.em.split('@')[1]!='163.com'){
    winNote('邮箱格式错误');
  }else if(form.pw!=form.pw2){
    winNote('两次输入密码不一致');
  }else{
    var text=JSON.stringify({app:'user',type:'signup',password:form.pw,email:form.em,username:form.un});
    $.post('backendURL',text,function(callback){
      if(callback=='finish'){
        winNote('注册成功');
        $('#signup').hide();
        $('#checkMail').fadeIn();        
      }else{
        winNote(callback.stackTrace);
      }
    });
  }
}
function goControl(){
  $('#home').fadeIn();
  winNote('加载中')
  $.getScript("relyURL/leancloud.js",function(){
    AV.init({appId: "appId",appKey: "appKey",serverURL: "serverURL"});
    const currentUser = AV.User.current();
    if (currentUser) {
      AV.User.logOut();
    } else {
      winNote('请先登录');
      winLogin();
    }
  });
}