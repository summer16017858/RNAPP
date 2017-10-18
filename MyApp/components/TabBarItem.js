import React,{Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons'

export default class TabBarItem extends Component {

    render() {
        return(
          <Icon name={  this.props.focused ? this.props.selectedImage : this.props.normalImage } size={30} color={'gray'}/>
        )
    }

}
