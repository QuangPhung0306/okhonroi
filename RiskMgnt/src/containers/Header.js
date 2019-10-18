import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableHighlight, Image} from 'react-native';
//import {Button} from 'react-native-elements';
//import Icon from 'react-native-vector-icons/FontAwesome';
import {Header, Left, Right} from 'native-base';

export default class HeaderForm extends Component {
  render() {
    return (
      <Header style={styles.container}>
        <Left>
          <TouchableHighlight underlayColor={'white'} onPress={this.props.actionOnPressLeft}>
            <Image
              source={require('../images/menu_web.png')}
              style={styles.StyleButton}
            />
          </TouchableHighlight>
        </Left>
        <Right>
          <TouchableHighlight underlayColor={'white'} onPress={this.props.actionOnPressRight}>
            <Image
              source={require('../images/userCircle.png')}
              style={styles.StyleButton}
            />
          </TouchableHighlight>
        </Right>
      </Header>
    );
  }
}
HeaderForm.PropTypes = {
  actionOnPressLeft: PropTypes.func.isRequired,
  actionOnPressRight: PropTypes.func.isRequired,
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fcfcfc',
  },
  StyleButton: {
    width: 40,
    height: 40,
  },
});
