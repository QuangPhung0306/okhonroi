/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet, TouchableHighlight, Image} from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import mapImg from '../../images/map.png';
export default class FooterHomeForm extends Component {
  isHomeScreen = this.props.isHomeScreen;
  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight underlayColor={'white'} onPress={this.props.actionOnPressHome}> 
          <Image
            source={require('../../images/home_web.png')}
            style={styles.StyleButton}
          />
        </TouchableHighlight>
        {this.props.isHomeScreen ?(
          <TouchableHighlight underlayColor={'white'} onPress={this.props.actionOnPressAdditems}>
            <Image
              source={require('../../images/add_web.png')}
              style={styles.StyleButton}
            />
          </TouchableHighlight>
        ):null}
        {this.props.isHomeScreen ?(
          <TouchableHighlight underlayColor={'white'} onPress={this.props.actionOnPressMap}>
            <Image
              source={require('../../images/map.png')}
              style={styles.StyleButton}
            />
          </TouchableHighlight>
        ):null}
        {this.props.isHomeScreen ?(
          <TouchableHighlight underlayColor={'white'} onPress={this.props.actionOnPressSearch}>
            <Image
              source={require('../../images/search.png')}
              style={styles.StyleButton}
            />
          </TouchableHighlight>
        ):null}
      </View>
    );
  }
}
FooterHomeForm.propTypes = {
  actionOnPressHome: PropTypes.func.isRequired,
  actionOnPressAdditems: PropTypes.func.isRequired,
  actionOnPressMap: PropTypes.func.isRequired,
  actionOnPressSearch: PropTypes.func.isRequired,
  isHomeScreen: PropTypes.bool,
  //isHomeScreen: boolean,
  // isHomeScreen : ,
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
