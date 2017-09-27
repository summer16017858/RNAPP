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
  ListView,
  TouchableHighlight,
  Image,
  Dimensions,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import request from '../util/util'
const width=Dimensions.get('window').width
const height=Dimensions.get('window').height
export default class ListRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      row:this.props.row,
      liked:this.props.row.liked
    };
  }
  componentDidMount(){
    // this._FetchData(this.state.pageNum)
  }
  _FetchData(page){
    console.log('fetch')
    const that=this;
    // fetch('http://rapapi.org/mockjs/26578/api/list?accessToken=1',{
    //   accessToken:'abcdf',
    //   page
    // })
    //     .then((response) => response.json())
    //     .then((responseJson) => {
    //       const data=Mock.mock(responseJson);
    //       console.log(responseJson,data,'dataSource')
    //       this.setState({
    //         dataSource:this.state.dataSource.cloneWithRows(data.data)
    //       })
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    this.setState({isLoading:true})
    request.get('http://rapapi.org/mockjs/26578/api/list',{
      accessToken:'1',
      page
    }).then(data=>{
      if(data.success){
        if(page!==0){
          this.state.item=this.state.item.concat(data.data)
        }else{
          this.state.item=data.data
        }
        console.log(data.data,this.state.item,'items')
        this.state.total=data.total
        setTimeout(()=>{
          that.setState({
            dataSource:this.state.dataSource.cloneWithRows(this.state.item),
            isLoading:false
          })
        },2000)
      }
    }).catch((error) => {
      console.error(error);
      this.setState({
        isLoading:false
      })
    });
  }
  _like(){
    const row=this.state.row;
    const liked=!this.state.liked;
    const that=this;
    const body={
      id:row.id,
      liked,
      accessToken:'111'
    }
    request.post('http://rapapi.org/mockjs/26578/api/like',body).then(data=>{
      if(data.success){
        that.setState({
          liked
        })
        console.log(this.state.liked,'liked')
      }else{
        Alert.alert('点暂失败')
      }

    }).catch(err=>{
      console.log(err)
    })
  }
  render() {
    const row=this.state.row;
    console.log(row,'row')
    return (
      <View>
        <TouchableHighlight>
          <View style={styles.item}>
            <Text>{row.title}</Text>
            <Image
            source={{uri:row.thumb}}
            style={styles.thumb}
            onPress={()=>{
              console.log('this.props.navigation.navigate')
              this.props.navigation.navigate('Account');
            }}
            >
              <Icon
                name='ios-play'
                size={28}
                style={styles.play}
              />
            </Image>
            <View style={styles.itemFooter}>
              <View style={styles.handleBox}>
                <Icon
                  name={this.state.liked?'ios-heart':'ios-heart-outline'}
                  size={28}
                  style={[styles.up,this.state.liked?null:styles.down]}
                  onPress={this._like.bind(this)}
                />
                <Text style={styles.handleText} onPress={this._like.bind(this)}>喜欢</Text>
              </View>
              <View style={styles.handleBox}>
                <Icon
                  name='ios-chatboxes'
                  size={28}
                  style={styles.up}
                />
                <Text style={styles.handleText}>评论</Text>
              </View>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fff'
  },
  item:{
    width:width,
    marginBottom:10,
    backgroundColor:'#fff'
  },
  thumb:{
    width:width,
    height:width*0.56,
    resizeMode:'cover'
  },
  title:{
    padding:10,
    fontSize:18,
    color:'#333'
  },
  itemFooter:{
    flexDirection:'row',
    justifyContent:'space-between',
    backgroundColor:'#eee'
  },
  handleBox:{
    padding:10,
    flexDirection:'row',
    width:width/2 - 0.5,
    justifyContent:'center',
    backgroundColor:'#fff'
  },
  play:{
    position:'absolute',
    bottom:14,
    right:14,
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
  handleText:{
    paddingLeft:12,
    fontSize:18,
    color:'#333'
  },
  down:{
    fontSize:22,
    color:'#333'
  },
  up:{
    fontSize:22,
    color:'#ed7b66'
  },
  loadingText:{
    textAlign:'center'
  }
})
