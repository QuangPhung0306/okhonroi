import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet, TouchableHighlight, Image} from 'react-native';

export default class FooterEditImage extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this.props.actionOnPressBack}>
          <Image
            source={require('../../images/back.png')}
            style={styles.StyleButton}
          />
        </TouchableHighlight>
        <TouchableHighlight onPress={this.props.actionOnPressChooseImage}>
          <Image
            source={require('../../images/forward.png')}
            style={styles.StyleButton}
          />
        </TouchableHighlight>
        <TouchableHighlight onPress={this.props.actionOnPressEditImage}>
          <Image
            source={require('../../images/pen.png')}
            style={styles.StyleButton}
          />
        </TouchableHighlight>
        <TouchableHighlight onPress={this.props.actionOnPressMixColor}>
          <Image
            source={require('../../images/color1.png')}
            style={styles.StyleButton}
          />
        </TouchableHighlight>
      </View>
    );
  }
}
FooterEditImage.propTypes = {
  actionOnPressBack: PropTypes.func.isRequired,
  actionOnPressEditImage: PropTypes.func.isRequired,
  actionOnPressMixColor: PropTypes.func.isRequired,
  actionOnPressChooseImage: PropTypes.func.isRequired,
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingLeft: 20,
  },
  StyleButton: {
    width: 40,
    height: 40,
  },
});
