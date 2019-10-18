import React, {Component} from 'react';
import {View, StyleSheet, Image, TouchableHighlight} from 'react-native';
import PropTypes from 'prop-types';
import GallerySwiper from 'react-native-gallery-swiper';

export default class ViewImageForm extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight
          underlayColor={'white'}
          onPress={this.props.actionOnPressLeft}
          style={styles.StyleBack}>
          <Image
            source={require('../../images/left-web.png')}
            style={styles.arrow}
          />
        </TouchableHighlight>
        <GallerySwiper
          images={[
            {
              uri:
                'https://luehangs.site/pic-chat-app-images/beautiful-blond-blonde-hair-478544.jpg',
            },
            {
              uri:
                'https://luehangs.site/pic-chat-app-images/beautiful-beautiful-women-beauty-40901.jpg',
            },
            {
              uri:
                'https://luehangs.site/pic-chat-app-images/animals-avian-beach-760984.jpg',
            },
          ]}
          initialNumToRender={2}
          sensitiveScroll={false}
          enableScale={false}
        />
        <TouchableHighlight
          underlayColor={'white'}
          onPress={this.props.actionOnPressRight}
          style={styles.StyleBack}>
          <Image
            source={require('../../images/right-web.png')}
            style={styles.arrow}
          />
        </TouchableHighlight>
      </View>
    );
  }
}
ViewImageForm.propTypes = {
  actionOnPressLeft: PropTypes.func.isRequired,
  actionOnPressRight: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  arrow: {
    width: 20,
    height: 20,
  },
  StyleBack: {
    justifyContent: 'center',
  },
});
