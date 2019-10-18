import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet, TouchableHighlight, Image} from 'react-native';

export default class FooterCamera extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight
          underlayColor={'white'}
          onPress={this.props.actionOnPressBackItem}>
          <Image
            source={require('../../images/backCircle.png')}
            style={styles.StyleButton}
          />
        </TouchableHighlight>
      </View>
    );
  }
}
FooterCamera.propTypes = {
  actionOnPressBackItem: PropTypes.func.isRequired,
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
