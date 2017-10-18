'use strict';
const mongoose = require('mongoose');
var User = mongoose.model('User');
const xss = require('xss')
const uuid = require('uuid')
const sms = require('../../servers/message')

exports.signUp = function *(next){
  const phoneNumber = this.request.body.phoneNumber;
  // const phoneNumber = this.query.phoneNumber;
  console.log(this.request,phoneNumber,'phoneNumber')
  let user = yield User.findOne({
    phoneNumber
  }).exec();
  var verifyCode = sms.getCode();
  if(!user){
    const token = uuid.v4()
    user = new User({
      nickname: '初始昵称',
      verifyCode: verifyCode,
      phoneNumber: xss(18405814607),
      accessToken: token,
      age:null,
      avator:'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1432929665,3497863733&fm=27&gp=0.jpg'
    })
  }else{
    user.verifyCode= verifyCode || (Math.random()*1000).toString()
  }
  try{
    user = yield user.save()
  }catch(err){
    this.body={
      success:false
    }
    return;
  }
  const msg = '您的注册验证码是：' + verifyCode
  try{
    // sms.send(user.phoneNumber,msg)
  }catch(err){
    console.log(err)
    this.body={
      success:false,
      error:'短信服务异常'
    }
    return next;
  }
  this.body={
    success:true
  }
}
exports.verify = function *(next){
  const verifyCode = this.request.body.verifyCode;
  const phoneNumber = this.request.body.phoneNumber;

  if(!verifyCode || !phoneNumber){
    this.body={
      success:false,
      error:'验证未通过'
    }
    return next
  }
  let user = yield User.findOne({
    phoneNumber,
    verifyCode
  }).exec();

  if(user){
    user.verified = true;
    user = yield user.save()
    this.body = {
      success: true,
      data: {
        nickname: user.nickname,
        accessToken: user.accessToken,
        avator: user.avator,
        format: user.format,
        version: user.version,
        gender: user.gender,
        age:user.nickname
      }
    }
    this.session.user = user;
  }else{
    this.body = {
      success: false,
      error: '验证未通过'
    }
  }
}
exports.update = function *(next){
  const body = this.request.body;
  const accessToken = body.accessToken;
  console.log(body,'update body')
  let user = yield User.findOne({
    accessToken: accessToken
  }).exec();
  if(!user){
    this.body = {
      success: false,
      error: '未找到对应信息'
    }
    return next
  }
  let fields = 'avator,gender,age,nickname,version,format'.split(',')
  fields.forEach((field) => {
    if(body[field]){
      user[field] = body[field]
    }
  })
  console.log(user,'update user')
  user = yield user.save()
  this.body={
    success: true,
    data: {
      nickname: user.nickname,
      accessToken: user.accessToken,
      avator: user.avator,
      age: user.age,
      gender: user.gender,
      _id: user._id,
      version:user.version,
      format:user.format
    }
  }
}
