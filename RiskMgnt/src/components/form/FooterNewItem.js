/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, TouchableHighlight, Image} from 'react-native';
export default class FooterNewItem extends Component {
  render() {
    if (this.props.isLongPressImage) {
      return (
        <View style={styles.container}>
          <TouchableHighlight
            underlayColor={'white'}
            onPress={this.props.actionOnPressBack}>
            <Image
              source={require('../../images/left-arrow-circle.png')}
              style={styles.StyleButton}
            />
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={'white'}
            onPress={this.props.actionOnPressTrash}>
            <Image
              source={require('../../images/garbage.png')}
              style={styles.StyleButton}
            />
          </TouchableHighlight>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <TouchableHighlight
          underlayColor={'white'}
          onPress={this.props.actionOnPressHome}>
          <Image
            source={require('../../images/home_web.png')}
            style={styles.StyleButton}
          />
        </TouchableHighlight>
        {this.props.isNewItem ? (
          <TouchableHighlight
            underlayColor={'white'}
            onPress={this.props.actionOnPressCamera}>
            <Image
              source={require('../../images/camera.png')}
              style={styles.StyleButton}
            />
          </TouchableHighlight>
        ) : null}
        {this.props.isNewItem ? (
          <TouchableHighlight
            underlayColor={'white'}
            onPress={this.props.actionOnPressPickImage}>
            <Image
              source={require('../../images/image3.png')}
              style={styles.StyleButton}
            />
          </TouchableHighlight>
        ) : null}
        <TouchableHighlight
          underlayColor={'white'}
          onPress={this.props.actionOnPressMap}>
          <Image
            source={require('../../images/map.png')}
            style={styles.StyleButton}
          />
        </TouchableHighlight>
      </View>
    );
  }
}

FooterNewItem.propTypes = {
  actionOnPressHome: PropTypes.func.isRequired,
  actionOnPressCamera: PropTypes.func.isRequired,
  actionOnPressMap: PropTypes.func.isRequired,
  actionOnPressPickImage: PropTypes.func.isRequired,
  isNewItem: PropTypes.bool,
  isLongPressImage: PropTypes.bool,
  actionOnPressBack: PropTypes.func.isRequired,
  actionOnPressTrash: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#fcfcfc',
  },
  StyleButton: {
    width: 40,
    height: 40,
  },
});
