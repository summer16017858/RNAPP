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
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import request from '../util/util'
import {StackNavigator,TabNavigator,TabBarBottom} from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons'
import {Header} from '../../components/index'
import ListRow from '../listRow/index'
const width=Dimensions.get('window').width
const height=Dimensions.get('window').height
export default class List extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      "selectedTab":"home",
       "dataSource": ds.cloneWithRows([]),
       "pageNum":1,
       "item":[],
       "total":0,
       "isLoading":false,
       "isRefreshing":false
    };
    this.selectTab= this.selectTab.bind(this)
  }
  componentDidMount(){
    this._FetchData(this.state.pageNum)
  }
  _hasMore(){
    return this.state.item.length!=this.state.total
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
  _fetchMoreData(){
    console.log(this,'fetch more')
    if(!this._hasMore() || this.state.isLoading){
      return
    }
    this._FetchData(this.state.pageNum++)
  }
  selectTab(val){
    this.setState({ selectedTab: val })
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
  _like(){

  }
  renderRow(row){
    console.log(ListRow,'ListRow')
    return (
      <ListRow row={row}/>
    )
  }
  _onRefresh(){
    if(!this._hasMore()||this.state.isRefreshing){
      return
    }
    this.setState({
      "isRefreshing":false
    })
    this._FetchData(0)
  }
  render() {
    return (
      <View style={styles.container}>
        <Header pageName= "主页"/>
        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          onEndReached={this._fetchMoreData.bind(this)}
          onEndReachedThreshold={20}
          renderFooter={this._renderFooter.bind(this)}
          renderRow={(rowData) => this.renderRow(rowData)}
          automaticallyAdjustContentInsets={false}
          showsVerticalScrollIndicator ={false}
          refreshControl={
           <RefreshControl
             refreshing={this.state.isRefreshing}
             onRefresh={this._onRefresh.bind(this)}
             tintColor="#eee"
             title="拼命加载中...."
             titleColor="#eee"
             colors={['#ff0000', '#00ff00', '#0000ff']}
             progressBackgroundColor="#eee"
           />
         }
        />
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
