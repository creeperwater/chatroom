//设置模式，加载依赖
'use strict';
const AV = require('leancloud-storage');
exports.main_handler = (event,context,callback) => {
  //解析请求体
  const request=JSON.parse(event.body);
  //初始化数据库
  if(request.app=='user'){
    AV.init({appId: "appId",appKey: "appKey",masterKey: "masterKey",serverURL: "serverURL"});
  }else if(request.app=='chat'){
    AV.init({appId: "appId",appKey: "appKey",masterKey: "masterKey",serverURL: "serverURL"});
  }else{
    callback('请求应用错误');
  }
  AV.Cloud.useMasterKey();
  //按类型处理请求
  if(request.type=='signup'){
    if(
      request.username.length>=1&&request.username.length<=10&&
      request.password.length>=5&&request.password.length<=20&&
      (request.email.split('@')[1]=='qq.com'||request.email.split('@')[1]=='163.com')
    ){
      const user = new AV.User();
      user.setUsername(request.username);
      user.setPassword(request.password);
      user.setEmail(request.email);
      user.signUp().then((user) => {
        callback(null,'finish');
      }, (error) => {
        callback(error.rawMessage);
      }); 
    }else{
      callback('请求被拦截');
    }
  }else if(request.type=='mainSend'){
    const query = new AV.Query('_User');
    query.get(request.id).then((user) => {
      if(user.get('emailVerified')==true&&user.get('level')>0&&request.token==user.getSessionToken()){
        const send = new AV.Object('main');
        send.set('name', user.get('username'));
        send.set('level', user.get('level'));
        send.set('img', user.get('img'));
        send.set('content', request.content);
        send.save().then((send) => {
          callback(null,'finish');
        }, (error) => {
          callback(error.rawMessage);
        });
      }else{
        callback('请求被拦截');
      }
    }, (error) => {
      callback(error.rawMessage);
    });
  }else{
    callback('请求类型错误');
  }
};