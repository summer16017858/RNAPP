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
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
const width=Dimensions.get('window').width
const height=Dimensions.get('window').height
import Swiper from 'react-native-swiper'
export default class Slider extends Component {
  constructor(props) {
    super(props);
    // console.log(this.props.screenProps,'this.props.screenProps')
    this.state = {
    };
  }
  componentDidMount(){

  }
  enter(){
    console.log('enter',this.props)
    this.props.enterSlide && this.props.enterSlide();
  }
  render() {
    return (
      <Swiper style={styles.container} dot={<View style={styles.dot}></View>} activeDot={<View style={styles.activeDot}></View>} paginationStyle={styles.pagination} loop={false}>
        <View style={styles.slide}>
          <Image style={styles.image} source={require('../assets/images/slider1.jpg')}/>
        </View>
        <View style={styles.slide}>
          <Image style={styles.image} source={require('../assets/images/slider2.jpg')}/>
        </View>
        <View style={styles.slide}>
          <Image style={styles.image} source={require('../assets/images/slider3.jpg')}/>
          <TouchableOpacity style={styles.enterBox} onPress={this.enter.bind(this)}>
            <Text style={styles.enterText}>进入App</Text>
          </TouchableOpacity>
        </View>
      </Swiper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#fff'
  },
  slide:{
    flex:1,
    width:width
  },
  image:{
    flex:1,
    width:width
  },
  dot:{
    width:13,
    height:13,
    backgroundColor:'transparent',
    borderColor:'#ccc',
    borderWidth:1,
    borderRadius:7,
    marginLeft:12,
    marginRight:12
  },
  activeDot:{
    width:13,
    height:13,
    backgroundColor:'#ee735c',
    borderColor:'#ccc',
    borderWidth:1,
    borderRadius:7,
    marginLeft:12,
    marginRight:12
  },
  pagination:{
    bottom:30,
  },
  enterBox:{
    width:width - 20,
    position:'absolute',
    left:10,
    bottom:70,
    height:50,
    padding:10,
    backgroundColor:'#ee735c',
    borderColor:'#ee735c',
    borderWidth:1,
    borderRadius:2
  },
  enterText:{
    color:'#fff',
    fontSize:20,
    fontWeight:'bold',
    textAlign:'center'
  }

})
