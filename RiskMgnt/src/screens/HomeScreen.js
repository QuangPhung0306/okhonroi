import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  AsyncStorage,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  Picker,
  TextInput,
  TouchableHighlight,
  Image,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Footer,
  FooterTab,
  Button,
} from 'native-base';
import RNFetchBlob from 'rn-fetch-blob';
import DatePicker from 'react-native-datepicker';
import * as Language from '../components/locales/Language.json';
import * as Define from '../components/locales/Define.json';
import * as API from '../components/locales/Define.json';
import HeaderForm from '../containers/Header';
import FooterHomeForm from '../components/form/FooterHomeForm';
import ShowItemHomeForm from '../components/form/ShowItemHomeForm';
import Modal from 'react-native-modal';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    backgroundColor: '#2980b6',
    paddingVertical: 15,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
  footer: {
    alignSelf: 'flex-end',
  },
  container1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  StyleView: {
    width: '100%',
    borderColor: 'black',
    borderWidth: 1,
    height: 70,
    justifyContent: 'center',
    padding: 5,
  },
  StyleText1: {
    //justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 20,
    padding: 10,
  },
  StyleDate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  StyleModal: {
    //flex: 0.7,
    width: '95%',

    backgroundColor: '#ffffff',
  },
  StyleButton: {
    width: 20,
    height: 20,
  },
  StyleExit: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  StyleSave: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 5,
    paddingTop: 5,
    paddingLeft: 5,
  },
  ButtonSave: {
    height: 30,
    backgroundColor: '#575859',
    justifyContent: 'center',
    alignItems: 'center',
  },
  //scrollView: {
  //  paddingLeft: 10,
  //  paddingRight: 30,
  //},
  StylePicker: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 40,
    width: '100%',
    flex: 0.9,
    borderColor: 'black',
  },
});

export default class HomeScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      header: (
        <HeaderForm
          actionOnPressRight={() =>
            navigation.navigate('User', {
              SCREEN_NAVIGATE: 'Home',
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
      DataShow: [],
      isDataLoaded: false,
      DataUser: null,
      isModalVisible: false,
      DateStart: '',
      DateEnd: '',
      InFormation: '',
      PlaceNameSelected: '',
      KindNameSelected: '',
      KindPicker: [],
      PlacePicker: [],
      KindData: [],
      PlaceData: [],
      refreshing: true,
      onSave: false,
      TagUser: '',
    };
  }

  onRefresh() {
    //Clear old data of the list
    this.setState({
      DataShow: [],
      isDataLoaded: false,
      DataUser: null,
      isModalVisible: false,
      DateStart: '',
      DateEnd: '',
      InFormation: '',
      PlaceNameSelected: '',
      KindNameSelected: '',
      KindPicker: [],
      PlacePicker: [],
      KindData: [],
      PlaceData: [],
      onSave: false,
      TagUser: '',
    });
    //Call the Service to get the latest data
    this.getLocalDataUser();
    this.getPickerData();
    this.getAllData();
  }

  onSave = async () => {
    //const {DateStart, DateEnd, PlaceNameSelected, KindNameSelected, PlaceData} = this.state;
    const retrievedItem = await AsyncStorage.getItem('DataUser');
    const item = JSON.parse(retrievedItem);
    if (this.state.DateStart > this.state.DateEnd) {
      Alert.alert('false');
      return;
    }
    this.setState({
      onSave: true,
    });
    var placeSearch = null;
    var kindSearch = null;
    var StartDate = 'startdate=' + this.state.DateStart.toString() + '&';
    var DayEnd = 'enddate=' + this.state.DateEnd.toString() + '&';
    var Tag = 'tag=' + this.state.TagUser.toString() + '&';
    var companyUser = item.companyid.toString() + '?';
    var IDPlace = null;
    var IDKind = null;

    var placeList = this.state.PlacePicker;
    var PlaceIndex = this.state.PlaceNameSelected;

    var kindList = this.state.KindPicker;
    var kindIndex = this.state.KindNameSelected;

    console.log('kindList:', kindList);
    console.log('kindIndex:', kindIndex);

    console.log('placeList:', placeList);
    console.log('PlaceIndex:', PlaceIndex);

    this.state.PlaceData.forEach(function(item) {
      if (placeList[PlaceIndex] === item.placename) {
        IDPlace = item.placeid;
      }
    });

    this.state.KindData.forEach(function(item) {
      if (kindList[kindIndex] === item.kindname) {
        IDKind = item.kindid;
      }
    });

    console.log('IDKind:', IDKind);
    console.log('IDPlace:', IDPlace);

    if (IDKind === null) {
      kindSearch = '';
    } else {
      kindSearch = 'kindid=' + IDKind.toString() + '&';
    }

    if (IDPlace === null) {
      placeSearch = '';
    } else {
      placeSearch = 'placeid=' + IDPlace.toString() + '&';
    }
    console.log('kindSearch:', kindSearch);
    console.log('placeSearch:', placeSearch);
    console.log('StartDate', StartDate);
    console.log('DayEnd', StartDate);
    var uri = Define.API_PATH + Define.GET_ALL_DATA + companyUser + Tag + kindSearch + placeSearch  + StartDate + DayEnd; //+ StartDate + DayEnd + Tag;
    console.log('uri: ', uri);
    let UserToken = await AsyncStorage.getItem('UserToken');
    var Authorization = 'Bearer ' + UserToken;
    console.log('Authorization', Authorization);
    RNFetchBlob.fetch('GET', uri, {
      Authorization: Authorization,
      'Content-Type': 'application/x-www-form-urlencoded',
    })
      .then(resp => {
        var informationData = '';
        var tempMSG = resp.data;
        var jsonObj = JSON.parse(tempMSG);
        console.log('jsonObj:', jsonObj);
        var DataShow = jsonObj.indicatedmatter;
        console.log('DataShow:', DataShow);
        var listLike = jsonObj.like;
        console.log('listLike:', listLike);     
        DataShow.forEach(function(itm) {
          if (listLike.includes(itm.dataid)) {
            itm.liked = true;
          } else {
            itm.liked = false;
          }
        });

        var InforData = jsonObj.infomation;
        console.log('InforData:', InforData);
        InforData.forEach(function(items) {
          if (items.companyid === item.companyid) {
            informationData = items.infodata;
          }
        });

        this.setState({
          DataShow: DataShow,
          isModalVisible: false,
          InFormation: informationData,
        });
      })
      .catch(err => {
        console.log('err: ', err);
      });
  };

  componentDidMount() {
    this.getLocalDataUser();
    this.getPickerData();
    this.getAllData();
  }

  getLocalDataUser = async () => {
    try {
      const retrievedItem = await AsyncStorage.getItem('DataUser');
      const item = JSON.parse(retrievedItem);
      this.setState({
        DataUser: item,
      });
      console.log('DataUser:', this.state.DataUser);
    } catch (error) {
      console.log(error.message);
    }
  };

  getPickerData = async () => {
    let UserToken = await AsyncStorage.getItem('UserToken');
    const retrievedItem = await AsyncStorage.getItem('DataUser');
    const item = JSON.parse(retrievedItem);
    console.log('item: ', item);
    var uri = API.API_PATH + API.GET_PICKER_DATA + item.companyid.toString();
    console.log('uri: ', uri);
    var Authorization = 'Bearer ' + UserToken;
    RNFetchBlob.fetch('GET', uri, {
      Authorization: Authorization,
      'Content-Type': 'application/x-www-form-urlencoded',
    })
      .then(resp => {
        var tempMSG = resp.data;
        var jsonObj = JSON.parse(tempMSG);
        var DataPicker = jsonObj.data;
        var listKind = DataPicker.kind;
        var listPlace = DataPicker.places;

        var PlacePicker = this.state.PlacePicker;
        var KindPicker = this.state.KindPicker;
        PlacePicker.push('');
        KindPicker.push('');
        listPlace.forEach(function(itm) {
          var itmx = itm.placename;
          PlacePicker.push(itmx);
        });
        listKind.forEach(function(itm) {
          var itmx = itm.kindname;
          KindPicker.push(itmx);
        });

        this.setState({
          PlacePicker: PlacePicker,
          KindPicker: KindPicker,
          PlaceData: listPlace,
          KindData: listKind,
        });

        console.log('this.state.PlaceData:', this.state.PlaceData);
        console.log('this.state.KindData:', this.state.KindData);
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

  getAllData = async () => {
    console.log('On_getAllData --- start');
    console.log(' Fetch... ');

    let UserToken = await AsyncStorage.getItem('UserToken');
    const retrievedItem = await AsyncStorage.getItem('DataUser');
    const item = JSON.parse(retrievedItem);
    console.log('item: ', item);
    var uri = Define.API_PATH + Define.GET_ALL_DATA + item.companyid.toString();
    var Authorization = 'Bearer ' + UserToken;
    RNFetchBlob.fetch('GET', uri, {
      Authorization: Authorization,
      'Content-Type': 'application/x-www-form-urlencoded',
    })
      .then(resp => {
        var informationData = '';
        var tempMSG = resp.data;
        var jsonObj = JSON.parse(tempMSG);
        var DataShow = jsonObj.indicatedmatter;
        console.log('DataShow:', DataShow);
        var InforData = jsonObj.infomation;
        console.log('InforData:', InforData);
        InforData.forEach(function(items) {
          if (items.companyid === item.companyid) {
            informationData = items.infodata;
          }
        });
        var listLike = jsonObj.like;
        console.log('listLike:', listLike);
        DataShow.forEach(function(itm) {
          if (listLike.includes(itm.dataid)) {
            itm.liked = true;
          } else {
            itm.liked = false;
          }
        });
        this.setState({
          InFormation: informationData,
          isDataLoaded: true,
          refreshing: false,
          DataShow: DataShow,
        });
        console.log('InFormation :', this.state.InFormation);
      })
      .catch(err => {
        console.log('err: ', err);
      });
  };

  onPressLike = async item => {
    console.log('onPressLike --- start');
    console.log(' Fetch... ');
    var uri = Define.API_PATH + Define.PRESS_LIKE;
    let UserToken = await AsyncStorage.getItem('UserToken');
    var Authorization = 'Bearer ' + UserToken;
    console.log('uri:', uri);
    console.log('entryuserid:', item.entryuserid);
    RNFetchBlob.fetch(
      'POST',
      uri,
      {
        Authorization: Authorization,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      [
        {name: 'entryuserid', data: item.entryuserid.toString()},
        {name: 'companyid', data: item.companyid.toString()},
        {name: 'dataid', data: item.dataid.toString()},
      ],
    )
      .then(resp => {
        var tempMSG = resp.data;
        console.log('tempMSG like:', tempMSG);
        var jsonObj = JSON.parse(tempMSG);
        console.log('jsonObj like:', jsonObj);

        this.setStateLike(item, jsonObj);
      })
      .catch(err => {
        console.log('err like: ', err);
      });
  };

  setStateLike = (item, jsonObj) => {
    item.countlike = jsonObj.data;
    item.liked = !item.liked;
    const index = this.state.DataShow.findIndex(
      items => item.dataid === items.dataid,
    );

    console.log('index DataShow: ', index);
    this.state.DataShow[index] = item;
    this.setState({
      DataShow: this.state.DataShow,
    });

    console.log('DataShow after Like: ', this.state.DataShow);
  };

  onPressItem = async item => {
    this.props.navigation.navigate('DetailItem');
  };

  renderItem = ({item}) => {
    var dt_array = item.entrydate.split(' ');
    var isStarOn = false;
    if (this.state.DataUser.userid === item.entryuserid) {
      isStarOn = true;
    }
    var NameRisk = null;
    this.state.KindData.forEach(function(itm) {
      if (itm.kindid === item.kindid) {
        NameRisk = itm.kindname;
      }
    });

    return (
      <ShowItemHomeForm
        DateTime={dt_array[0].replace(/-/gi, '/')}
        Note={item.comments + '!'}
        Risk={NameRisk}
        isStarOn={isStarOn}
        CountLike={item.countlike}
        ImageUri={item.image1}
        isLiked={item.liked}
        onPressLike={() => this.onPressLike(item)}
        onPressItem={() => this.onPressItem(item)}
      />
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: '100%',
          backgroundColor: '#fff',
        }}
      />
    );
  };

  setModalVisible() {
    this.setState({isModalVisible: !this.state.isModalVisible});
  }

  render() {
    if (!this.state.isDataLoaded) {
      return (
        <View style={styles.container1}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <Container>
        <View style={{flex: 1, marginLeft: 10, marginRight: 10}}>
          <View style={styles.StyleText1}>
            <Text style={{fontSize: 20}}>{Language.HOME_DAY}</Text>
            <View style={styles.StyleView}>
              <Text style={{justifyContent: 'flex-start', fontSize: 20}}>
                {this.state.InFormation}
              </Text>
            </View>
          </View>
          <View style={styles.StyleText1}>
            {this.state.onSave ? (
              <Text style={{fontSize: 20}}>{Language.AFTER_SEARCH}</Text>
            ) : (
              <Text style={{fontSize: 20}}>{Language.BEFORE_SEARCH}</Text>
            )}
          </View>
          <FlatList
            data={this.state.DataShow}
            renderItem={this.renderItem}
            extraData={this.state}
            ItemSeparatorComponent={this.renderSeparator}
            refreshControl={
              <RefreshControl
                //refresh control used for the Pull to Refresh
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh.bind(this)}
              />
            }
          />
        </View>
        <Modal
          avoidKeyboard={false}
          animationType="slide"
          //transparent={false}
          isVisible={this.state.isModalVisible}>
          <View style={styles.StyleModal}>
            <View style={styles.StyleSave}>
              <TouchableHighlight
                style={styles.StyleExit}
                onPress={() => {
                  this.setModalVisible(!this.state.isModalVisible);
                }}
                underlayColor={'white'}>
                <Image
                  source={require('../images/cancel_web.png')}
                  style={styles.StyleButton}
                />
              </TouchableHighlight>
              <TouchableOpacity style={styles.ButtonSave} onPress={this.onSave}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 20,
                    padding: 2,
                    paddingLeft: 15,
                    paddingRight: 15,
                  }}>
                  {Language.SAVE}
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              <View style={{padding: 3, paddingLeft: 10, paddingRight: 30}}>
                <Text style={{fontSize: 20}}>{Language.LOCATION}</Text>
                <View style={{borderColor: 'gray', borderWidth: 1}}>
                  <Picker
                    style={{height: 40}}
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
              <View style={{padding: 3, paddingLeft: 10, paddingRight: 30}}>
                <Text style={{fontSize: 20}}>{Language.RISK}</Text>
                <View style={{borderColor: 'gray', borderWidth: 1}}>
                  <Picker
                    style={{height: 40}}
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
              <View style={{padding: 3, paddingLeft: 10, paddingRight: 30}}>
                <Text style={{fontSize: 20}}>{Language.TAG}</Text>
                <TextInput
                  style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                  value={this.state.TagUser}
                  onChangeText={TagUser => this.setState({TagUser})}
                />
              </View>
              <Text
                style={{
                  padding: 3,
                  paddingLeft: 10,
                  paddingRight: 30,
                  fontSize: 20,
                }}>
                {' '}
                {Language.CALENDAR}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  paddingLeft: 10,
                  paddingRight: 30,
                  padding: 10,
                }}>
                <View style={{flex: 0.2, justifyContent: 'center'}}>
                  <Text style={{textAlign: 'center', fontSize: 20}}>
                    {Language.START}
                  </Text>
                </View>
                <DatePicker
                  style={styles.StylePicker}
                  date={this.state.DateStart}
                  mode="date"
                  format="YYYY-MM-DD"
                  //confirmBtnText="Confirm"
                  //cancelBtnText="Cancel"
                  customStyles={{
                    dateInput: {
                      marginLeft: 10,
                    },
                  }}
                  onDateChange={date => {
                    this.setState({DateStart: date});
                  }}
                  showIcon={false}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  paddingLeft: 10,
                  paddingRight: 30,
                  padding: 10,
                }}>
                <View style={{flex: 0.2, justifyContent: 'center'}}>
                  <Text style={{textAlign: 'center', fontSize: 20}}>
                    {Language.END}
                  </Text>
                </View>
                <DatePicker
                  style={styles.StylePicker}
                  date={this.state.DateEnd}
                  format="YYYY-MM-DD"
                  //confirmBtnText="Confirm"
                  //cancelBtnText="Cancel"
                  customStyles={{
                    dateInput: {
                      marginLeft: 10,
                    },
                  }}
                  onDateChange={date => {
                    this.setState({DateEnd: date});
                  }}
                  showIcon={false}
                />
              </View>
            </ScrollView>
          </View>
        </Modal>
        <Footer>
          <FooterHomeForm
            actionOnPressHome={() => this.props.navigation.navigate('Home')}
            actionOnPressAdditems={() =>
              this.props.navigation.navigate('NewItem')
            }
            actionOnPressMap={() =>
              this.props.navigation.navigate('Map', {
                SCREEN_MAP_NAVIGATE: 'Home',
              })
            }
            actionOnPressSearch={() => this.setModalVisible()}
            isHomeScreen={true}
          />
        </Footer>
      </Container>
    );
  }
}
