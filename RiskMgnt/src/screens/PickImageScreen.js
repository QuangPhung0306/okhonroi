import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
  Alert,
} from 'react-native';

import CameraRoll from '@react-native-community/cameraroll';
import PhotoGrid from 'react-native-image-grid';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Container, Footer} from 'native-base';
import * as Define from '../components/locales/Language.json';
import HeaderForm from '../containers/Header';
import FooterCamera from '../components/form/FooterCamera';
import Check from '../images/tick-circle.png';
import unCheck from '../images/circle.png';

export default class PickImage extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      header: (
        <HeaderForm
          title={Define.NEW_ITEM}
          actionOnPressRight={() =>
            navigation.navigate('User', {
              SCREEN_NAVIGATE: 'PickImage',
            })
          }
          actionOnPressLeft={() => navigation.openDrawer()}
        />
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      isCameraLoaded: false,
    };
  }

  componentDidMount = async () => {
    if (Platform.OS === 'android') {
      await checkAndroidPermission();
    }
    CameraRoll.getPhotos({first: 100}).then(
      data => {
        const assets = data.edges;
        const images = assets.map(asset => asset.node.image);
        const locations = assets.map(asset => asset.node.location);
        const types = assets.map(asset => asset.node.type);
        console.log('asset.node: ', assets);

        images.forEach(function(itm) {
          if (locations[images.indexOf(itm)] !== undefined) {
            itm.latitude = locations[images.indexOf(itm)].latitude;
            itm.longitude = locations[images.indexOf(itm)].longitude;
          } else {
            itm.latitude = undefined;
            itm.longitude = undefined;
          }
          itm.isSelected = false;
          itm.type = types[images.indexOf(itm)];
        });

        const imagesSelected = this.props.navigation.getParam(
          'IMAGES_SELECTED',
        );
        console.log('imagesSelected_1: ', imagesSelected);

        if (imagesSelected.length > 0) {
          imagesSelected.forEach(function(itm) {
            images.forEach(function(item) {
              if (itm.uri === item.uri) {
                item.isSelected = true;
              }
            });
          });
        }
        console.log('images addProperty: ', images);

        this.setState({
          isCameraLoaded: true,
          images: images,
        });
      },
      error => {
        console.log('error getPhotos: ', error);
      },
    );
  };

  _onPressCheck = item => {
    //var CountMaxChoose = 0;
    // this.state.images.forEach(function(itm) {
    //   if (itm.isSelected === true) {
    //     CountMaxChoose++;
    //   }
    // });
    // console.log('CountMaxChoose : ', CountMaxChoose);
    // if (CountMaxChoose >= 3 && item.isSelected === false) {
    //   Alert.alert(Define.WARNING_MAX_IMAGE);
    //   console.log('images onclick1: ', this.state.images);
    //   return;
    // }

    item.isSelected = !item.isSelected;

    const index = this.state.images.findIndex(
      items => item.filename === items.filename,
    );
    //  console.log('index Photo: ', index);

    this.state.images[index] = item;
    this.setState({
      images: this.state.images,
    });

    //  console.log('images onclick2: ', this.state.images);
  };

  renderItem = (item, itemSize, itemPaddingHorizontal) => {
    return (
      <TouchableOpacity
        style={{
          width: itemSize - 20,
          height: itemSize - 20,
          paddingHorizontal: itemPaddingHorizontal + 10,
          paddingVertical: itemPaddingHorizontal + 10,
          justifyContent: 'flex-end',
        }}
        onPress={() => this._onPressCheck(item)}>
        <Image resizeMode="cover" style={{flex: 1}} source={{uri: item.uri}} />
        <View
          style={{
            paddingBottom: 11,
            paddingRight: 11,
            position: 'absolute',
            alignSelf: 'flex-end',
          }}>
          {item.isSelected ? (
            <Image source={Check} style={styles.checkbox} />
          ) : (
            <Image source={unCheck} style={styles.checkbox} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  onPressResisterImage() {
    var imagesSelected = this.props.navigation.getParam('IMAGES_SELECTED');
    console.log('imagesSelected_1: ', imagesSelected);
    var indexToRemove = [];
    this.state.images.forEach(function(itm) {
      if (itm.isSelected === true) {
        var isExist = false;
        imagesSelected.forEach(function(item) {
          if (item.uri === itm.uri) {
            isExist = true;
          }
        });
        if (isExist === false) {
          var itemPush = {};
          itemPush.uri = itm.uri;
          itemPush.isSelected = false;
          itemPush.isLocalImage = true;
          itemPush.filename = itm.filename;
          itemPush.latitude = itm.latitude;
          itemPush.longitude = itm.longitude;
          itemPush.type = itm.type;
          itemPush.DateTime = undefined;
          imagesSelected.push(itemPush);
          console.log('imagesSelected_2: ', imagesSelected);
        }
      } else {
        imagesSelected.forEach(function(item) {
          if (item.uri === itm.uri) {
            var index = imagesSelected.indexOf(item);
            indexToRemove.push(index);
          }
        });
      }
    });

    for (var j = indexToRemove.length - 1; j >= 0; j--) {
      imagesSelected.splice(indexToRemove[j], 1);
    }
    console.log('imagesSelected_3: ', imagesSelected);

    if (imagesSelected.length > 3) {
      Alert.alert(Define.WARNING_MAX_IMAGE);
      return;
    } else if (imagesSelected.length === 0) {
      Alert.alert(Define.NO_IMAGE_CHOOSE);
      return;
    }

    this.props.navigation.navigate('NewItem', {
      IMAGES_SELECTED: imagesSelected,
    });
  }

  render() {
    if (!this.state.isCameraLoaded) {
      return (
        <View style={styles.container1}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <Container>
        <View style={styles.StylePic}>
          <View style={styles.headerFormImage}>
            <Text style={{alignSelf: 'flex-end', fontSize: 20}}>
              {Define.PLEASE_SELECT_IMAGE}
            </Text>
            <TouchableOpacity
              style={{backgroundColor: '#808080', justifyContent: 'center'}}
              onPress={() => this.onPressResisterImage()}>
              <Text
                style={{
                  fontSize: 20,
                  color: '#fff',
                  paddingLeft: 5,
                  paddingRight: 5,
                }}>
                {Define.SELECT}
              </Text>
            </TouchableOpacity>
          </View>

          <PhotoGrid
            data={this.state.images}
            itemsPerRow={2}
            itemMargin={1}
            itemPaddingHorizontal={1}
            renderItem={this.renderItem}
          />
        </View>
        <Footer>
          <FooterCamera
            actionOnPressBackItem={() =>
              this.props.navigation.navigate('NewItem')
            }
            style={styles.back}
          />
        </Footer>
      </Container>
    );
  }
}

const checkAndroidPermission = async () => {
  try {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    await PermissionsAndroid.request(permission);
    Promise.resolve();
  } catch (error) {
    Promise.reject(error);
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    paddingHorizontal: 10,
  },
  listContainer: {
    alignItems: 'center',
  },
  headerFormImage: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  back: {
    backgroundColor: '#F5FCFF',
    alignItems: 'flex-start',
  },
  separator: {
    marginTop: 10,
  },
  /******** card **************/
  card: {
    marginVertical: 8,
    backgroundColor: 'white',
    flexBasis: '45%',
    marginHorizontal: 10,
  },
  cardContent: {
    paddingVertical: 17,
    justifyContent: 'space-between',
  },
  cardImage: {
    flex: 1,
    height: 150,
    width: null,
  },
  imageContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  /******** card components **************/
  title: {
    fontSize: 18,
    flex: 1,
    color: '#778899',
  },
  count: {
    fontSize: 18,
    flex: 1,
    color: '#B0C4DE',
  },
  checkbox: {
    height: 25,
    width: 25,
  },
  container1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  StylePic: {
    flex: 1,
    padding: 15,
    paddingTop: 5,
    paddingBottom: 1,
  },
});
