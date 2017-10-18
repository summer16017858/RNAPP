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
  AsyncStorage,
  ActivityIndicator
} from 'react-native';
import {StackNavigator,TabNavigator,TabBarBottom} from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import Icon from 'react-native-vector-icons/Ionicons'
import {List,Account,Edit,Login,Slider} from './app/index'
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
        style:{backgroundColor:'#ffffff'},
        labelStyle: {
              fontSize: 20, // 文字大小
          }
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
        animationEnabled:true
      },
      mode:'card',
      transitionConfig: () => ({
        screenInterpolator: CardStackStyleInterpolator.forHorizontal
      })
    });
class MyApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "selectedTab":"home",
      logined:false,
      booted:false,
      entered:false
    };
    this.selectTab= this.selectTab.bind(this)
  }
  componentDidMount(){
    this.asyncAppStatus()
  }
  selectTab(val){
    this.setState({ selectedTab: val })
  }
  afterLogin(user){
    user = JSON.stringify(user)
    const that = this;
    AsyncStorage.setItem('user',user).then(() => {
      that.setState({
        logined:true,
        user
      })
    })
  }
  asyncAppStatus(){
    AsyncStorage.multiGet(['user','entered']).then((data) => {
      let user;
      let userDate = data[0][1]
      let enteredDate = data[1][1]
      let newState = {
        booted:true
      }
      console.log(data,'AsyncStorage')
      if(userDate){
        user = JSON.parse(userDate);
      }
      if(user&&user.accessToken){
        newState.user = user;
        newState.logined = true;
      }else{
        newState.logined = false;
      }
      if(enteredDate){
        newState.entered = true
      }
      this.setState(newState);
    })
  }
  loginOut(){
    console.log('登出')
    AsyncStorage.removeItem('user');
    this.setState({
      logined:false,
      user:null
    })
  }
  enterSlider(){
    console.log('enterSlider')
    this.setState({
      entered:true
    })
    // this.setState({
    //   entered:true
    // },() => {
    //   AsyncStorage.setItem('entered','true')
    // })
  }
  render() {
    if(!this.state.logined){
      return <Login afterLogin={this.afterLogin.bind(this)}/>
      // return <Slider/>
    }
    if(!this.state.booted){
      return (
        <View style={styles.bootedBox}>
          <ActivityIndicator
             animating={this.state.animating}
             style={[styles.centering, {height: 80}]}
             size="large"
             color='#ee735c'
           />
        </View>
      )
    }
    if(!this.state.entered){
      // return <Login afterLogin={this.afterLogin.bind(this)}/>
      return <Slider enterSlide={this.enterSlider.bind(this)}/>
    }
    return (
      <View style={styles.container}>
        <Navigator screenProps={{user:this.state.user,loginOut:this.loginOut.bind(this)}}/>
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
 },
 bootedBox:{
   flex:1,
   alignItems:'center',
   justifyContent:'center'
 }
});

AppRegistry.registerComponent('MyApp', () => MyApp);
