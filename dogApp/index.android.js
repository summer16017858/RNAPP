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
import {StackNavigator,TabNavigator,TabBarBottom} from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons'
import {List,Account,Edit} from './app/index'
import {TabBarItem} from './components/index'
import Products from './app/list/products'
const Tab = TabNavigator(
  {
    Home:{
      screen:List,
      navigationOptions:({navigation}) => ({
        tabBarLabel:'首页',
        tabBarIcon:({focused,tintColor}) => (
          <TabBarItem
            tintColor={tintColor}
            focused={focused}
            normalImage={'ios-home'}
            selectedImage={'ios-home-outline'}
          />
        )
      }),
    },
    Edit:{
        screen:Edit,
        navigationOptions:({navigation}) => ({
        tabBarLabel:'制作',
        tabBarIcon:({focused,tintColor}) => (
          <TabBarItem
           tintColor={tintColor}
            focused={focused}
            normalImage={'ios-recording'}
            selectedImage={'ios-recording-outline'}
          />
        )
      }),
    },
    Mine:{
          screen:Account,
          navigationOptions:({navigation}) => ({
          tabBarLabel:'我',
          tabBarIcon:({focused,tintColor}) => (
            <TabBarItem
              tintColor={tintColor}
              focused={focused}
              normalImage={'ios-more'}
              selectedImage={'ios-more-outline'}
            />
          )
        }),
      },
    },

    {
      tabBarComponent:TabBarBottom,
      tabBarPosition:'bottom',
      swipeEnabled:false,
      animationEnabled:false,
      lazy:true,
      tabBarOptions:{
        activeTintColor:'#06c1ae',
        inactiveTintColor:'#979797',
        style:{backgroundColor:'#ffffff',},
        labelStyle: {
              fontSize: 20, // 文字大小
          },
      }

    }

  );
  const Navigator = StackNavigator(

    {
      Products:{screen:Products}
    },

    {
      navigationOptions:{
        headerBackTitle:null,
        headerTintColor:'#333333',
        showIcon:true,
        swipeEnabled:false,
        animationEnabled:false,
      },

      mode:'card',
    });
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
        <Tab/>
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
