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
  Dimensions
} from 'react-native';
import Mock from 'mockjs'
import Icon from 'react-native-vector-icons/Ionicons'
import {Header} from '../../components/index'
const width=Dimensions.get('window').width
const height=Dimensions.get('window').height
export default class List extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      "selectedTab":"home",
       "dataSource": ds.cloneWithRows([]),
    };
    this.selectTab= this.selectTab.bind(this)
  }
  componentDidMount(){
    this._FetchData()
  }
  _FetchData(){
    console.log('fetch')
    fetch('http://rapapi.org/mockjs/26578/api/list?accessToken=1')
        .then((response) => response.json())
        .then((responseJson) => {
          const data=Mock.mock(responseJson);
          console.log(responseJson,data,'dataSource')
          this.setState({
            dataSource:this.state.dataSource.cloneWithRows(data.data)
          })
        })
        .catch((error) => {
          console.error(error);
        });
  }
  selectTab(val){
    this.setState({ selectedTab: val })
  }
  renderRow(row){
    return (
      <TouchableHighlight>
        <View style={styles.item}>
          <Text>{row.title}</Text>
          <Image
          source={{uri:row.thumb}}
          style={styles.thumb}
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
                name='ios-heart'
                size={28}
                style={styles.up}
              />
              <Text style={styles.handleText}>喜欢</Text>
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
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <Header pageName= "主页"/>
        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={(rowData) => this.renderRow(rowData)}
          automaticallyAdjustContentInsets={false}
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
  up:{
    fontSize:22,
    color:'#333'
  }
})
