import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet, TouchableHighlight, Image} from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
export default class FormCheck extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight underlayColor={'white'} onPress={this.props.actionOnPressCancel}>
          <Image
            source={require('../../images/cancel_web.png')}
            style={styles.StyleButton}
          />
        </TouchableHighlight>
        <TouchableHighlight underlayColor={'white'} onPress={this.props.actionOnPressDone}>
          <Image
            source={require('../../images/check.png')}
            style={styles.StyleButton}
          />
        </TouchableHighlight>
      </View>
    );
  }
}
FormCheck.PropTypes = {
  actionOnPressCancel: PropTypes.func.isRequired,
  actionOnPressDone: PropTypes.func.isRequired,
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
// nut tich chon trang chon anh 