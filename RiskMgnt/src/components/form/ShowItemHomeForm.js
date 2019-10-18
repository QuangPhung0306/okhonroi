import React, {Component} from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

import star from '../../images/star.png';
import like from '../../images/like.png';
import liked from '../../images/liked.png';
import * as Language from '../../components/locales/Language.json';

export default class ShowItemHomeForm extends Component {
  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this.props.onPressItem}>
        <View style={styles.infor}>
          <Image source={{uri: this.props.ImageUri}} style={styles.image} />
        </View>
        <View style={styles.infor1}>
          <View style={styles.infoBox}>
            <Text style={{fontSize: 18}}>{this.props.DateTime}</Text>
            {this.props.isStarOn ? (
              <Image source={star} style={styles.Star} />
            ) : null}
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity onPress={this.props.onPressLike}>
                {this.props.isLiked ? (
                  <Image source={liked} style={styles.Like} />
                ) : (
                  <Image source={like} style={styles.Like} />
                )}
              </TouchableOpacity>
              <Text style={{fontSize: 18}}>{this.props.CountLike}</Text>
            </View>
          </View>
          <Text style={styles.text}>{this.props.Note}</Text>
          <Text style={styles.text}>
            {Language.RISK} : {this.props.Risk}{' '}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

ShowItemHomeForm.PropTypes = {
  ImageUri: PropTypes.string,
  DateTime: PropTypes.string,
  Note: PropTypes.string,
  Risk: PropTypes.string,
  isStarOn: PropTypes.bool,
  CountLike: PropTypes.string,
  isLiked: PropTypes.bool,
  onPressLike: PropTypes.func.isRequired,
  onPressItem: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    height: 140,
    flexDirection: 'row',
    padding: 5,
  },
  image: {
    height: 130,
    resizeMode: 'contain',
  },
  infor: {
    flex: 1,
  },
  infor1: {
    flex: 1,
    justifyContent: 'space-around',
    padding: 5,
  },
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  Star: {
    width: 20,
    height: 20,
  },
  Like: {
    width: 30,
    height: 30,
  },
  text: {
    color: 'black',
    fontSize: 18,
  },
});
