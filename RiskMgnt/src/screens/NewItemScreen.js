import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  Picker,
  TextInput,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';

import RNFetchBlob from 'rn-fetch-blob';
import PhotoGrid from 'react-native-image-grid';
import RNFS from 'react-native-fs';

import dotVertical from '../images/dotVertical.png';
import Check from '../images/tick-circle.png';
import unCheck from '../images/circle.png';

import Icon from 'react-native-vector-icons/FontAwesome';
import {Container, Content, Footer} from 'native-base';

import * as Define from '../components/locales/Language.json';
import * as API from '../components/locales/Define.json';

import HeaderForm from '../containers/Header';
import FooterNewItem from '../components/form/FooterNewItem';

export default class NewItemScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      header: (
        <HeaderForm
          title={Define.NEW_ITEM}
          actionOnPressRight={() =>
            navigation.navigate('User', {
              SCREEN_NAVIGATE: 'NewItem',
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
      imagesSelected: [],
      isVisible: false,
      uriShow: '',
      isShowPicker: false,
      KindPicker: [],
      PlacePicker: [],
      PlaceNameSelected: '',
      KindNameSelected: '',
      listKind: [],
      listPlace: [],
      Tag: '',
      Comments: '',
      UserName: '',
      listUsers: [],
      loading: false,
    };
  }

  componentDidMount = async () => {
    this.getPickerData();
  };

  onPressRegister = async () => {
    this.setState({
      loading: true,
    });

    let UserToken = await AsyncStorage.getItem('UserToken');
    var uri = API.API_PATH + API.RESISTER_NEW_ITEM;

    const retrievedItem = await AsyncStorage.getItem('DataUser');
    const item = JSON.parse(retrievedItem);
    const companyID = item.companyid;

    var placeID = null;
    var kindID = null;
    var PlacePicker = this.state.PlacePicker;
    var KindPicker = this.state.KindPicker;
    var PlaceNameSelected = this.state.PlaceNameSelected;
    var KindNameSelected = this.state.KindNameSelected;

    this.state.listPlace.forEach(function(itm) {
      if (itm.placename === PlacePicker[PlaceNameSelected]) {
        placeID = itm.placeid;
      }
    });
    this.state.listKind.forEach(function(itm) {
      if (itm.kindname === KindPicker[KindNameSelected]) {
        kindID = itm.kindid;
      }
    });

    var UserName = this.state.UserName;
    var entryUserID = '';
    this.state.listUsers.forEach(function(itm) {
      if (itm.username === UserName) {
        entryUserID = itm.userid.toString();
      }
    });

    console.log('imagesSelected: ', this.state.imagesSelected);
    console.log('placeID: ', placeID);
    console.log('kindID: ', kindID);
    console.log('Tag: ', this.state.Tag);
    console.log('Comment: ', this.state.Comments);
    console.log('companyID: ', companyID);
    console.log('entryUserID: ', entryUserID);

    var ImageResister = this.state.imagesSelected;

    if (ImageResister.length < 1) {
      Alert.alert(Define.PLEASE_CHOOSE_IMAGE);
      this.setState({
        loading: false,
      });
      return;
    }

    var latitude = undefined;
    var longitude = undefined;

    if (ImageResister[0].latitude !== undefined) {
      latitude = ImageResister[0].latitude.toString();
    }
    if (ImageResister[0].longitude !== undefined) {
      latitude = ImageResister[0].longitude.toString();
    }

    var dataGet = null;
    var dataGet1 = null;
    var dataGet2 = null;

    await RNFS.readFile(ImageResister[0].uri, 'base64').then(res => {
      dataGet = res;
    });
    await RNFS.readFile(ImageResister[1].uri, 'base64').then(res => {
      dataGet1 = res;
    });
    await RNFS.readFile(ImageResister[2].uri, 'base64').then(res => {
      dataGet2 = res;
    });

    console.log('filename1: ', ImageResister[0].filename);
    console.log('type1: ', ImageResister[0].type);

    console.log('data: ', dataGet);
    console.log('data1: ', dataGet1);
    console.log('data2: ', dataGet2);

    RNFetchBlob.fetch(
      'POST',
      uri,
      {
        Authorization: 'Bearer ' + UserToken,
        'Content-Type': 'multipart/form-data',
      },
      [
        {
          name: 'image1',
          filename: ImageResister[0].filename,
          type: ImageResister[0].type,
          data: dataGet,
        },
        {
          name: 'image2',
          filename: ImageResister[1].filename,
          type: ImageResister[1].type,
          data: dataGet1,
        },
        {
          name: 'image3',
          filename: ImageResister[2].filename,
          type: ImageResister[2].type,
          data: dataGet2,
        },
        {name: 'companyid', data: companyID.toString()},
        {name: 'kindid', data: kindID.toString()},
        {name: 'placeid', data: placeID.toString()},
        {name: 'tag', data: this.state.Tag},
        {name: 'latitude', data: latitude},
        {name: 'longitude', data: longitude},
        {name: 'correctimage1', data: '1'},
        {name: 'correctimage2', data: '1'},
        {name: 'correctimage3', data: '1'},
        {name: 'entryuserid', data: entryUserID},
        {name: 'comments', data: this.state.Comments},
      ],
    )
      .then(resp => {
        var tempMSG = resp.data;
        console.log('tempMSG: ', tempMSG);
        this.setState({
          loading: false,
        });
        this.props.navigation.navigate('Home');
      })
      .catch(err => {
        console.log('err: ', err);
      });
  };

  actionOnPressTrash() {
    var indexToRemove = [];
    var imagesSelected = this.state.imagesSelected;

    imagesSelected.forEach(function(itm) {
      if (itm.isSelected === true) {
        var index = imagesSelected.indexOf(itm);
        indexToRemove.push(index);
      }
    });

    for (var j = indexToRemove.length - 1; j >= 0; j--) {
      imagesSelected.splice(indexToRemove[j], 1);
    }

    this.setState({
      isShowPicker: false,
      imagesSelected: imagesSelected,
    });
  }

  getPickerData = async () => {
    let UserToken = await AsyncStorage.getItem('UserToken');
    const retrievedItem = await AsyncStorage.getItem('DataUser');
    const item = JSON.parse(retrievedItem);
    var uri = API.API_PATH + API.GET_PICKER_DATA + item.companyid.toString();
    var Authorization = 'Bearer ' + UserToken;
    RNFetchBlob.fetch('GET', uri, {
      Authorization: Authorization,
      'Content-Type': 'application/x-www-form-urlencoded',
    })
      .then(resp => {
        var tempMSG = resp.data;
        var jsonObj = JSON.parse(tempMSG);
        var DataPicker = jsonObj.data;
        //console.log('DataShow:', DataPicker);
        var listKind = DataPicker.kind;
        //console.log('listKind:', listKind);
        var listPlace = DataPicker.places;
        //console.log('listPlace:', listPlace);
        var listUsers = DataPicker.users;

        var PlacePicker = this.state.PlacePicker;
        var KindPicker = this.state.KindPicker;

        listPlace.forEach(function(itm) {
          var itmx = itm.placename;
          PlacePicker.push(itmx);
        });

        listKind.forEach(function(itm) {
          var itmx = itm.kindname;
          KindPicker.push(itmx);
        });

        //console.log('PlacePicker:', PlacePicker);
        //console.log('KindPicker:', KindPicker);

        this.setState({
          PlacePicker: PlacePicker,
          KindPicker: KindPicker,
          listKind: listKind,
          listPlace: listPlace,
          listUsers: listUsers,
        });
      })
      .catch(err => {
        console.log('err: ', err);
      });
  };

  UpdatePlaceNameSelected = PlaceNameSelected => {
    this.setState({PlaceNameSelected: PlaceNameSelected});
  };

  UpdateKindNameSelected = KindNameSelected => {
    this.setState({KindNameSelected: KindNameSelected});
  };

  OpenLongClickOption() {
    //console.log('OpenLongClickOption');
    this.setState({isShowPicker: !this.state.isShowPicker});
  }

  OpenOption = item => {
    Alert.alert(
      null,
      null,
      [
        {
          text: Define.CANCEL,
          //onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: Define.DELETE_IMAGE,
          onPress: () => {
            var index = this.state.imagesSelected.indexOf(item);
            if (index !== -1) {
              this.state.imagesSelected.splice(index, 1);
              this.setState({
                imagesSelected: this.state.imagesSelected,
              });
            }
          },
        },
        {
          text: Define.EDIT_IMAGE,
          onPress: () => {},
        },
      ],
      {cancelable: false},
    );
  };

  actionOnPickImage = item => {
    item.isSelected = !item.isSelected;
    const index = this.state.imagesSelected.findIndex(
      items => item.uri === items.uri,
    );

    this.state.imagesSelected[index] = item;
    this.setState({
      imagesSelected: this.state.imagesSelected,
    });
  };

  actionCancelPickImage() {
    this.state.imagesSelected.forEach(function(itm) {
      itm.isSelected = false;
    });
    this.setState({
      imagesSelected: this.state.imagesSelected,
      isShowPicker: false,
    });
  }

  handleTagChange = text => {
    this.setState({Tag: text});
  };

  handleCommentChange = text => {
    this.setState({Comments: text});
  };

  renderItem = (item, itemSize, itemPaddingHorizontal) => {
    return (
      <View style={{borderColor: 'gray', borderWidth: 1}}>
        <TouchableOpacity
          style={{
            width: itemSize - 30,
            height: itemSize / 2,
            paddingHorizontal: itemPaddingHorizontal + 1,
            justifyContent: 'flex-end',
          }}
          onPress={() => {
            this.setState({isVisible: true, uriShow: item.uri});
          }}
          onLongPress={() => {
            this.setState({isShowPicker: true});
          }}>
          {this.state.isShowPicker ? (
            <TouchableOpacity onPress={() => this.actionOnPickImage(item)}>
              {item.isSelected ? (
                <Image source={Check} style={styles.StyleCheck} />
              ) : (
                <Image source={unCheck} style={styles.StyleCheck} />
              )}
            </TouchableOpacity>
          ) : null}
          <Image
            style={{flex: 1}}
            resizeMode="contain"
            source={{uri: item.uri}}
          />
        </TouchableOpacity>
        <View style={styles.option}>
          <Text style={{paddingLeft: 5}}>{item.DateTime}</Text>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => this.OpenOption(item)}>
            <Image
              source={dotVertical}
              style={{width: 20, height: 20, alignSelf: 'center'}}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    this.state.UserName = this.props.navigation.getParam('User_Item_id');
    return (
      <Container>
        <Content>
          <View style={styles.ContainImageBox}>
            <View style={styles.headerNewItems}>
              <Text style={{alignSelf: 'flex-end', fontSize: 20}}>
                {Define.SHOW_IMAGE}
              </Text>
              <TouchableOpacity
                style={{backgroundColor: '#808080', justifyContent: 'center'}}
                onPress={this.onPressRegister}>
                <Text
                  style={{
                    fontSize: 20,
                    color: '#fff',
                    paddingLeft: 5,
                    paddingRight: 5,
                  }}>
                  {Define.ADD_NEW}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{paddingTop: 3, paddingLeft: 20, minHeight: 200}}>
              <PhotoGrid
                data={this.state.imagesSelected}
                itemsPerRow={2}
                itemMargin={1}
                itemPaddingHorizontal={1}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => index}
              />
            </View>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              padding: 25,
              paddingTop: 3,
              alignItems: 'stretch',
            }}>
            <View style={{padding: 3}}>
              <Text style={{fontSize: 20}}>{Define.LOCATION}</Text>
              <View style={{borderColor: 'gray', borderWidth: 1}}>
                <Picker
                  style={{height: 40, fontSize: 20}}
                  mode="dropdown"
                  selectedValue={this.state.PlaceNameSelected}
                  onValueChange={this.UpdatePlaceNameSelected}>
                  {this.state.PlacePicker.map((item, index) => {
                    return (
                      <Picker.Item label={item} value={index} key={index} />
                    );
                  })}
                </Picker>
              </View>
            </View>
            <View style={{padding: 3}}>
              <Text style={{fontSize: 20}}>{Define.COMMENT}</Text>
              <TextInput
                style={{
                  fontSize: 20,
                  height: 80,
                  borderColor: 'gray',
                  borderWidth: 1,
                }}
                multiline
                numberOfLines={2}
                onChangeText={this.handleCommentChange}
              />
            </View>
            <View style={{padding: 3}}>
              <Text style={{fontSize: 20}}>{Define.RISK}</Text>
              <View style={{borderColor: 'gray', borderWidth: 1}}>
                <Picker
                  style={{height: 40, fontSize: 20}}
                  mode="dropdown"
                  selectedValue={this.state.KindNameSelected}
                  onValueChange={this.UpdateKindNameSelected}>
                  {this.state.KindPicker.map((item, index) => {
                    return (
                      <Picker.Item label={item} value={index} key={index} />
                    );
                  })}
                </Picker>
              </View>
            </View>
            <View style={{padding: 3}}>
              <Text style={{fontSize: 20}}>{Define.TAG}</Text>
              <TextInput
                style={{
                  fontSize: 20,
                  height: 40,
                  borderColor: 'gray',
                  borderWidth: 1,
                }}
                onChangeText={this.handleTagChange}
              />
            </View>
            <View style={{padding: 3}}>
              <Text style={{fontSize: 20}}>{Define.PEOPLE}</Text>
              <TouchableOpacity
                style={{
                  height: 40,
                  borderColor: 'gray',
                  borderWidth: 1,
                  justifyContent: 'center',
                }}
                onPress={() => this.props.navigation.navigate('ChooseUser')}>
                <Text style={{fontSize: 20}}>{this.state.UserName}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Modal
            visible={this.state.isVisible}
            animationType="slide"
            transparent={false}>
            <View style={styles.fullscreenImage}>
              <Image
                resizeMode="contain"
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
          <Modal
            visible={this.state.loading}
            animationType="slide"
            transparent={true}>
            <View style={styles.loading}>
              <ActivityIndicator size="large" />
            </View>
          </Modal>
        </Content>
        <Footer>
          <FooterNewItem
            actionOnPressHome={() => this.props.navigation.navigate('Home')}
            actionOnPressCamera={() =>
              this.props.navigation.navigate('Camera', {
                IMAGES_SELECTED: this.state.imagesSelected,
              })
            }
            actionOnPressMap={() =>
              this.props.navigation.navigate('Map', {
                SCREEN_MAP_NAVIGATE: 'NewItem',
              })
            }
            actionOnPressPickImage={() =>
              this.props.navigation.navigate('PickImage', {
                IMAGES_SELECTED: this.state.imagesSelected,
              })
            }
            isNewItem={true}
            isLongPressImage={this.state.isShowPicker}
            actionOnPressBack={() => this.actionCancelPickImage()}
            actionOnPressTrash={() => this.actionOnPressTrash()}
          />
        </Footer>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    height: 250,
    width: 250,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 30,
    backgroundColor: '#fcfcfc',
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
    backgroundColor: '#000',
  },
  ContainImageBox: {
    padding: 15,
    paddingTop: 5,
    paddingBottom: 1,
    flex: 1,
  },
  StyleCheck: {height: 25, width: 25},
  headerNewItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 30,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
