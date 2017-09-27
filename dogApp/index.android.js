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
  View
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons'
import TabNavigator from 'react-native-tab-navigator'
import {List,Account,Edit} from './app/index'

export default class dogApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "selectedTab":"home",
    };
    this.selectTab= this.selectTab.bind(this)
  }
  selectTab(val){
    this.setState({ selectedTab: val })
  }
  render() {
    return (
      <View style={styles.container}>
        <TabNavigator tabBarStyle={{ backgroundColor:'#fff' }} style={{backgroundColor: 'white'}} >
            <TabNavigator.Item
               title="主页"
               titleStyle={styles.tabText}
               selected={this.state.selectedTab === 'home'}
               renderIcon={() => <Icon name={ 'ios-home' } size={30} color={'gray'}/>}
               renderSelectedIcon={() => <Icon name={ 'ios-home' } size={30} color={'#4E78E7'}/>}
               onPress={() =>  this.selectTab('home')}>
               <List></List>
           </TabNavigator.Item>
           <TabNavigator.Item
                 title="录制"
                 titleStyle={styles.tabText}
                 selected={this.state.selectedTab === 'recording'}
                 renderIcon={() => <Icon name={ 'ios-recording' } size={30} color={'gray'}/>}
                 renderSelectedIcon={() => <Icon name={ 'ios-recording' } size={30} color={'#4E78E7'}/>}
                 onPress={() => this.selectTab('recording')}>
                 <Edit/>
             </TabNavigator.Item>
           <TabNavigator.Item
                 title="其他"
                 titleStyle={styles.tabText}
                 selected={this.state.selectedTab === 'other'}
                 renderIcon={() => <Icon name={ 'ios-more' } size={30} color={'gray'}/>}
                 renderSelectedIcon={() => <Icon name={ 'ios-more' } size={30} color={'#4E78E7'}/>}
                 onPress={() =>  this.selectTab('other')}>
                 <Account/>
             </TabNavigator.Item>
        </TabNavigator>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fff'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
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
 }
});

AppRegistry.registerComponent('dogApp', () => dogApp);
