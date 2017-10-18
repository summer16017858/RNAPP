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
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ListView,
  Modal,
  TextInput,
  Button
} from 'react-native';
import Video from 'react-native-video'
import request from '../util/util'
const width=Dimensions.get('window').width
import Icon from 'react-native-vector-icons/Ionicons'
export default class Products extends Component {
  static navigationOptions = {
     title: '详情',//设置标题内容
 };
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      "selectedTab":"home",
      rate:1,
      pause:false,
      muted:false,
      dataSource:ds.cloneWithRows([]),
      resizeMode:"cover",
      repeat:false,
      duration:0,
      currentTime:0,
      videoReady:false,
      percent:0.01,
      playing:false,
      paused:false,
      videoSuccess:true,
      item:[],
      total:0,
      modalVisible:false,
      isSending:false
    };
  }
  componentDidMount(){
    this._fetchData()
  }
  _fetchData(){
    const that=this;
    request.get('http://rapapi.org/mockjs/26578/api/comments',{
      id:123,
      accessToken:'22'
    }).then((data)=>{
      console.log(data,'data2ddas')
      if(data&&data.success){
        const comments=data.data;
        if(comments&&comments.length>0){
          that.setState({
            comments,
            dataSource:that.state.dataSource.cloneWithRows(comments)
          })
        }
      }
    }).catch((err)=>{
      console.log('error:'+err)
    })
  }
  onLoad(data) {
    console.log('On load fired!');
    // this.setState({duration: data.duration});
  }

  onProgress(data) {
    if(!this.state.videoReady){
      this.setState({
        videoReady:true
      })
    }
    const duration = data.playableDuration;
    const currentTime = data.currentTime;
    const percent = Number(currentTime/duration).toFixed(2)
    let newState = {
      duration,
      currentTime,
      percent
    }
    if(!this.state.videoReady){
      newState.videoReady=true
    }
    if(percent <1 && !this.state.playing){
      newState.playing=true
    }
    this.setState(newState)
    // this.setState({currentTime: data.currentTime});
  }
  onEnd(){
    this.setState({
      percent:1,
      playing:false
    })
  }
  onBuffer({ isBuffering }: { isBuffering: boolean }) {
    this.setState({ isBuffering });
  }
  onStart(data){
    console.log(data,'onStart')
  }
  videoError(error){
    this.setState({
      videoSuccess:false
    })
    console.log(error,'error')
  }
  _rePlay(){
    this.refs.videoPlayer.seek(0.1)
    console.log(this.state.paused,'paused')
  }
  _pause(){
    console.log(this.state.paused,'this.state.pause')
      this.setState({
        paused:!this.state.paused
      })
  }
  _resume(){
    if(this.state.paused){
      this.setState({
        paused:false
      })
    }
  }
  renderRow(row){
    return (
      <View key={row.id} style={styles.replyBox}>
        <Image style={styles.replyAvator} source={{uri:row.replyBy.avator}}/>
        <View style={styles.reply}>
          <Text style={styles.replyNickname}>{row.replyBy.nickname}</Text>
          <Text style={styles.replyContent}>{row.content}</Text>
        </View>
      </View>
    )
  }
  _hasMore(){
    return this.state.item.length!=this.state.total
  }
  _renderFooter(){
    if(!this._hasMore() && this.state.total!==0){
      return (
        <View>
          <Text style={styles.loadingText}>没有更多了</Text>
        </View>
      )
    }
    return (
      <View>
        <ActivityIndicator
        animating={this.state.isLoading}
        style={[styles.centering, {height: 80}]}
        size="large"
        />
      </View>
    )
  }
  _fetchMoreData(){
    // console.log(this,'fetch more')
    if(!this._hasMore() || this.state.isLoading){
      return
    }
    this._fetchData(this.state.pageNum++)
  }
  _focus(){
    this._setModalVisible(true)
  }
  _setModalVisible(val){
    this.setState({
      modalVisible:val
    })
  }
  _blur(){
    this._setModalVisible(false)
  }
  closeModal(){
    this._setModalVisible(false)
  }
  submit(){
    const that=this
    if(!this.state.content){
      return Alert.alert('不能为空')
    }
    if(this.state.isSending){
      return Alert.alert('正在发送')
    }
    this.setState({
      isSending:true
    },()=>{
      const body={
        accessToken:123,
        creation:123,
        comment:this.state.content
      }

      console.log('request')
      request.post('http://rapapi.org/mockjs/26578/api/submitComment',body).then((data)=>{
        if(data && data.success){
          console.log('request success')
          let items=this.state.comments.slice()
          items=[{
            content:this.state.content,
            replyBy:{
              nickname:'testSubmit',
              avator:'https://gss1.bdstatic.com/-vo3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=642887bc5182b2b7a79f3ec20996acd2/aa64034f78f0f7366aaf53b90255b319ebc41330.jpg'
            }
          }].concat(items)
          console.log(items,'items')
          that.setState({
            comments:items,
            isSending:false,
            dataSource:that.state.dataSource.cloneWithRows(items),
            modalVisible:false
          })
        }
      })
    })
  }
  renderInfo(){
    const { params } = this.props.navigation.state;;
    return (
      <View>
        <View style={styles.infoBox}>
          <Image style={styles.avator} source={{uri:params.data.author.avator}}/>
          <View style={styles.descBox}>
            <Text style={styles.nickname}>{params.data.author.nickname}</Text>
            <Text style={styles.title}>{params.data.title}</Text>
          </View>
        </View>
        <View style={styles.commentBox}>
          <TextInput placeholder="请输入评论内容" multiline={true} style={styles.content} onFocus={this._focus.bind(this)} default={this.state.content}/>
        </View>
        <View style={styles.commentArea}>
          <Text style={styles.commentTitle}>精彩评论</Text>
        </View>
      </View>
    )
  }
  render() {
    const { params } = this.props.navigation.state;;
    console.log(params,'detail data')
    console.log(this.state.playing,'this.state.playing')
    return (
      <View style={styles.container}>
        <Text>this is products Pagessss</Text>
        <View style={styles.videoBox}>
          <Video
            ref="videoPlayer"
            style={styles.fullScreen}
            source={{uri:'http://oxshaoiv8.bkt.clouddn.com/' + params.data.qiniu_video}}
            // source={{uri:'http://tv.sohu.com/upload/swf/20170919/Main.swf'}}
            // source={{uri:params.data.videoUrl,type:'blob'}}
            volume={1}
            paused={this.state.paused}
            rate={this.state.rate}
            resizeMode={this.state.resizeMode}
            repeat={this.state.repeat}
            onStart={this.onStart.bind(this)}
            onLoad={() => { console.log('on!') }}
            onBuffer={this.onBuffer.bind(this)}
            onProgress={this.onProgress.bind(this)}
            onEnd={this.onEnd.bind(this)}
            onError={this.videoError.bind(this)}
          />
          {!this.state.videoReady&&<ActivityIndicator
          animating={!this.state.videoReady}
          style={[styles.centering, {height: 80}]}
          size="large"
          />}
          {this.state.videoReady && !this.state.playing?
            <Icon
              onPress={this._rePlay.bind(this)}
              name='ios-play'
              size={28}
              style={styles.playIcon}
            />:null
          }
          {!this.state.videoSuccess?
            <Text style={styles.failText}>抱歉，视频出错了</Text>:null
          }
          {
            this.state.videoReady && this.state.playing ?
            <TouchableOpacity onPress={this._pause.bind(this)} style={styles.pauseBtn}>
              {
                this.state.paused?<Icon onPress={this._resume.bind(this)} name='ios-play' size={28} style={styles.resumeIcon}/>:<Text></Text>
              }
            </TouchableOpacity>:null
          }
          <View style={styles.progressBox}>
            <View style={[styles.progressBar,{width:width*this.state.percent}]}></View>
          </View>
        </View>
        <ScrollView style={styles.scrollView}>
          {this.renderInfo()}
        </ScrollView>
        <ListView
          enableEmptySections={true}
          // onEndReached={this._fetchMoreData.bind(this)}
          dataSource={this.state.dataSource}
          onEndReachedThreshold={20}
          // renderFooter={this._renderFooter.bind(this)}
          renderRow={(rowData) => this.renderRow(rowData)}
          automaticallyAdjustContentInsets={false}
          showsVerticalScrollIndicator ={false}
        />
        <Modal
          animationType={'fade'}
          visible={this.state.modalVisible}
          onRequestClose={this._setModalVisible.bind(false,this)}
        >
          <View style={styles.modalContainer}>
            <Icon
              onPress={this.closeModal.bind(this)}
              name="ios-close-outline"
              style={styles.closeIcon}
            />
            <View style={styles.commentBox}>
              <TextInput placeholder="请输入评论内容" multiline={true} style={styles.content} onFocus={this._focus.bind(this)} onBlur={this._blur.bind(this)} default={this.state.content} onChangeText={(text)=>{
                this.setState({
                  content:text
                })
              }}/>
            </View>
            <Button
              onPress={this.submit.bind(this)}
              title="提交"
              accessibilityLabel="See an informative alert"
            />
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#fff'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  videoBox:{
    width:width,
    height:222,
    backgroundColor:'#000'
  },
  fullScreen: {
    width:width,
    height:220,
    backgroundColor:'#000'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  tabText:{
   color:'#000000',
   fontSize:10
 },
 selectedTabText:{
   color:'#D81E06'
 },
 icon:{
   width:20,
   height:20
 },
 centering:{
   position:'absolute',
   top:50,
   left:0,
   width:width,
   alignItems:'center'
 },
 prograssBox:{
   width:width,
   height:2,
   backgroundColor:'#ccc'
 },
 progressBar:{
   width:1,
   height:2,
   backgroundColor:'#ff6600'
 },
 playIcon:{
   position:'absolute',
   zIndex:4,
   bottom:14,
   left:14,
   width:46,
   height:46,
   paddingTop:9,
   paddingLeft:18,
   backgroundColor:'transparent',
   borderColor:"#fff",
   borderRadius:23,
   borderWidth:1,
   color:'#ed7b66'
 },
 pauseBtn:{
   position:'absolute',
   left:0,
   top:0,
   width:width,
   height:220,
   alignItems:'center',
   justifyContent:'center',
 },
 resumeIcon:{
   width:46,
   height:46,
   paddingTop:9,
   paddingLeft:18,
   backgroundColor:'transparent',
   borderColor:"#fff",
   borderRadius:23,
   borderWidth:1,
   color:'#ed7b66'
 },
 failText:{
   alignItems:'center',
   position:'absolute',
   zIndex:2,
   color:'#fff'
 },
 infoBox:{
   width:width,
   paddingTop:10,
   flexDirection:'row',
   justifyContent:'center',
   alignItems:'center',
   marginTop:10,
 },
 avator:{
   width:60,
   height:60,
   marginRight:10,
   marginLeft:10,
   borderRadius:30
 },
 descBox:{
   flex:1
 },
 nickname:{
   fontSize:18
 },
 title:{
   marginTop:10,
   fontSize:10,
   color:'#666'
 },
 replyBox:{
   flexDirection:'row',
   justifyContent:'flex-start',
   marginTop:10,
 },
 replyAvator:{
   width:40,
   height:40,
   marginRight:10,
   marginLeft:10,
   borderRadius:20
 },
 replyNickname:{
   color:'#666'
 },
 replyContent:{
   color:'#666',
   marginTop:4
 },
commentBox:{
  marginTop:10,
  marginBottom:10,
  padding:8,
  width:width,
},
content:{
  paddingLeft:2,
  color:'#333',
  borderWidth:1,
  borderColor:'#ddd',
  borderRadius:4,
  fontSize:14,
  height:80
},
commentArea:{
  width:width,
  marginTop:10,
  paddingBottom:6,
  paddingLeft:10,
  paddingRight:10,
  borderBottomWidth:1,
  borderBottomColor:'#eee'
},
modalContainer:{
  flex:1,
  paddingTop:45,
  backgroundColor:'#fff'
},
closeIcon:{
alignSelf:'center',
fontSize:22,
color:'#ee753c'
}
})
