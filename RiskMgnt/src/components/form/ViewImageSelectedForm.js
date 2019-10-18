import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';

import PropTypes from 'prop-types';

import PhotoGrid from 'react-native-image-grid';

import dotVertical from '../../images/dotVertical.png';

import Icon from 'react-native-vector-icons/FontAwesome';

export default class ViewImageSelectedForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imagesSelected: this.props.imagesSelected,
      isVisible: false,
      uriShow: '',
      isShowPicker: false,
    };
  }
  OpenLongClickOption() {
    console.log('OpenLongClickOption');
    this.setState({isShowPicker: !this.state.isShowPicker});
  }
  OpenOption() {
    Alert.alert(
      'Tùy Chọn',
      null,
      [
        {
          text: 'Hủy',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Xóa',
          onPress: () => {
            this.props.deleteImage;
          },
        },
        {
          text: 'Chỉnh sửa',
          onPress: () => {
            this.props.editImage;
          },
        },
      ],
      {cancelable: false},
    );
  }
  renderItem = (item, itemSize, itemPaddingHorizontal) => {
    return (
      <View>
        <View>
          <TouchableOpacity
            style={{
              width: itemSize,
              height: 150,
              paddingHorizontal: itemPaddingHorizontal,
              justifyContent: 'flex-end',
            }}
            onPress={() => {
              this.setState({isVisible: true, uriShow: item.uri});
            }}
            onLongPress={() => {
              this.setState({isShowPicker: true});
            }}>
            <Image
              style={{flex: 1}}
              resizeMode="contain"
              source={{uri: item.uri}}
            />
            <Icon
              name={this.state.isShowPicker ? 'check-circle' : null}
              size={30}
              color="black"
            />
          </TouchableOpacity>
          <View style={styles.option}>
            <Text style={{padding: 2}}>{item.DateTime}</Text>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => this.OpenOption()}>
              <Image source={dotVertical} style={{width: 20, height: 20}} />
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          visible={this.state.isVisible}
          animationType="slide"
          transparent={false}>
          <View style={styles.fullscreenImage}>
            <Image
              resizeMode="cover"
              source={{uri: this.state.uriShow}}
              style={{flex: 1}}
            />
            <TouchableOpacity
              style={styles.overlayCancel}
              onPress={() => {
                this.setState({isVisible: false});
              }}>
              <Icon name="close" style={styles.cancelIcon} size={28} />
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  };

  render() {
    return (
      <PhotoGrid
        data={this.state.imagesSelected}
        itemsPerRow={2}
        itemMargin={1}
        itemPaddingHorizontal={1}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => index}
      />
    );
  }
}

ViewImageSelectedForm.propTypes = {
  imagesSelected: PropTypes.object,
  deleteImage: PropTypes.func.isRequired,
  editImage: PropTypes.func.isRequired,
};
const styles = StyleSheet.create({
  container: {
    height: 250,
    width: 250,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 30,
  },
  containerImage: {
    flex: 1,
    // remove width and height to override fixed static size
    width: null,
    height: null,
  },
  overlayCancel: {
    padding: 20,
    position: 'absolute',
    right: 10,
    top: 0,
  },
  cancelIcon: {
    color: 'white',
  },
  fullscreenImage: {
    flex: 1,
  },
});
