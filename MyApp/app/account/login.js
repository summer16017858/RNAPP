/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert
} from 'react-native';
import request from '../util/util'
import CountDownTimer from 'react_native_countdowntimer'
import {CountDownText} from 'react-native-sk-countdown';
export default class Login extends Component {
  static navigationOptions = {
     title: '快速登录',//设置标题内容
 };
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber:'',
      codeSent:false,
      countDone:false,
      verifyCode:''
    };
  }
  showVerifyCode(){
    this.setState({
      codeSent:true
    })
  }
  componentDidMount(){
  }
  sendVerifyCode(){
    const that=this;
    const phoneNumber=this.state.phoneNumber
    if(!phoneNumber){
      return Alert.alert('手机号码不能为空')
    }
    const body={
      phoneNumber:phoneNumber
    }
    console.log(body,'body')
    request.post('http://localhost:8888/api/user/signup',body).then(data=>{
      console.log(data,'data 获取验证码')
      if(data&&data.success){
        that.showVerifyCode()
      }else{
        Alert.alert('获取验证码失败')
      }
    }).catch(error=>{
      Alert.alert('检查网络是否良好')
    })
  }
  submit(){
    const that = this;
    const phoneNumber = this.state.phoneNumber;
    const verifyCode = this.state.verifyCode;
    if(!phoneNumber || !verifyCode){
      return Alert.alert('手机号或验证码不能为空')
    }
    const body = {
      phoneNumber,
      verifyCode
    }
    request.post('http://localhost:8888/api/user/verify',body).then((data)=>{
      console.log(data, ' data 登陆')
      if(data && data.success){
        that.props.afterLogin(data.data);
      }else{
        Alert.alert('登陆失败')
      }
    }).catch(err => {
      Alert.alert('登陆失败,请检查网络是否良好')
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.signupBox}>
          <TextInput
            placeholder="请输入手机号"
            atuoCaptialize={'none'}
            autoCorrect={false}
            keyboradType={'number-type'}
            style={styles.inputField}
            onChangeText={(text)=>{
              this.setState({
                phoneNumber:text
              })
            }}
          />
          {
            this.state.codeSent?
            <View style={styles.verifyCodeBox}>
              <TextInput
                placeholder="请输入验证码"
                atuoCaptialize={'none'}
                autoCorrect={false}
                keyboradType={'number-type'}
                style={styles.verifyCode}
                onChangeText={(text)=>{
                  console.log(text,'text')
                  this.setState({
                    verifyCode:text
                  })
                }}
              />
              {
                this.state.countDone?
                <Button style={styles.btn} onPress={this.sendVerifyCode.bind(this)} title="获取验证码"/>:
              //   <CountDownTimer
              //      //date={new Date(parseInt(endTime))}
              //      date="2017-10-06T00:00:00+00:00"
              //      days={{plural: 'Days ',singular: 'day '}}
              //      hours=':'
              //      mins=':'
              //      segs=''
               //
              //      daysStyle={styles.time}
              //      hoursStyle={styles.time}
              //      minsStyle={styles.time}
              //      secsStyle={styles.time}
              //      firstColonStyle={styles.colon}
              //      secondColonStyle={styles.colon}
              //  />
              <CountDownText
                style={styles.cd}
                countType='seconds' // 计时类型：seconds / date
                auto={true} // 自动开始
                afterEnd={() => {}} // 结束回调
                timeLeft={60} // 正向计时 时间起点为0秒
                step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
                startText='获取验证码' // 开始的文本
                endText='获取验证码' // 结束的文本
                intervalText={(sec) => sec + '秒重新获取'} // 定时的文本回调
              />
              }
            </View>:null
          }
          {this.state.codeSent?
            <Button style={styles.btn} onPress={this.submit.bind(this)} title="登陆"/>:
            <Button style={styles.btn} onPress={this.sendVerifyCode.bind(this)} title="获取验证码"/>
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:10,
    backgroundColor:'#f9f9f9'
  },
  singupBox:{
    marginTop:30
  },
  title:{
    marginBottom:20,
    color:'#333',
    fontSize:20,
    textAlign:'center'
  },
  inputField:{
    color:'#666',
    padding:5,
    fontSize:16,
    height:40,
    backgroundColor:'#fff',
    borderRadius:4
  },
  verifyCode:{
    color:'#666',
    padding:5,
    fontSize:16,
    height:40,
    marginTop:10,
    backgroundColor:'#fff',
    borderRadius:4
  },
  btn:{
    margin:10,
    padding:10,
    backgroundColor:'transparent',
    borderColor:'#ee735c',
    borderWidth:1,
    borderRadius:4,
    color:'#ee735c'
  }
})
