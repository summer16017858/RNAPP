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
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import Icon from 'react-native-vector-icons/Ionicons'
import {List,Account,Edit} from './app/index'
import {TabBarItem} from './components/index'
import Products from './app/list/products'
const Tab = TabNavigator(
  {
    Home:{
      screen:List,
      navigationOptions:({navigation,screenProps}) => ({
        tabBarLabel:'首页',
        headerTitle:'首页',
        headerTintColor:'#333333',
        headerTitleStyle:{
          alignSelf:'center'
        },
        headerStyle:{
          height:60
        },
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
        headerTitle:'首页2',
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
      Tab:{screen:Tab},
      Products:{screen:Products}
    },
    {
      navigationOptions:{
        headerTruncatedBackTitle:'返回',
        headerTintColor:'#333',
        showIcon:true,
        swipeEnabled:true,
        animationEnabled:true,
      },
      mode:'card',
      transitionConfig: () => ({
        screenInterpolator: CardStackStyleInterpolator.forHorizontal
      })
    });
export default class MyApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "selectedTab":"home",
      user:null
    };
    this.selectTab= this.selectTab.bind(this)
  }
  componentDidMount(){
    AsyncStorage.getItem('user').then(data => {
      let user;
      if(data){
        user = JSON.parse(data)
      }
      console.log(user,'user first')
      if(data && data.accessToken){
        this.setState({
          user:user
        })
      }
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <Navigator user={this.state.user}/>
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

AppRegistry.registerComponent('MyApp', () => MyApp);
