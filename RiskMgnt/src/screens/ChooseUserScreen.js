import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  AsyncStorage,
  Picker,
  FlatList,
} from 'react-native';
import * as Define from '../components/locales/Language.json';
import HeaderForm from '../containers/Header';
import {Container, Footer, Content} from 'native-base';
import FooterCamera from '../components/form/FooterCamera';
import search_white from '../images/search-white.png';
import white_down from '../images/white-down.png';
import {SearchBar} from 'react-native-elements';
import RNFetchBlob from 'rn-fetch-blob';
import * as API from '../components/locales/Define.json';

export default class ChooseUserScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      header: (
        <HeaderForm
          actionOnPressRight={() =>
            navigation.navigate('User', {
              SCREEN_NAVIGATE: 'ChooseUser',
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
      search: null,
      isSearchBar: false,
      ListUsers: [],
      ListGroups: [],
      ListShowGroup: [],
      ListUserShow: [],
      arrayHolder: [],
      NameGroupSelected: '',
    };
  }

  componentWillMount = async () => {
    this.getPickerData();
  };

  updateSearch = search => {
    this.setState({
      search: search,
    });
    if (search === null || search === '') {
      this.setState({
        isSearchBar: false,
        ListUserShow: this.state.ListUsers,
      });
      return;
    }
    let text = search.toLowerCase();
    //console.log(' this.state.arrayHolder: ', this.state.arrayHolder);
    let filteredName = this.state.arrayHolder.filter(item => {
      return item.username.toLowerCase().match(text);
    });
    this.setState({
      ListUserShow: filteredName,
    });
  };

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
        var DataAll = jsonObj.data;

        var listUserGet = DataAll.users;

        var listGroupGet = DataAll.group;

        this.state.ListUsers = listUserGet;
        this.state.ListGroups = listGroupGet;

        var ListShowGroup = this.state.ListShowGroup;
        ListShowGroup.push('ALL');

        listGroupGet.forEach(function(itm) {
          var itmx = itm.groupname;
          ListShowGroup.push(itmx);
        });

        this.state.ListUsers = listUserGet;
        this.state.ListGroups = listGroupGet;

        this.setState({
          listUser: this.state.ListUsers,
          ListGroups: this.state.ListGroups,
          ListShowGroup: ListShowGroup,
        });

        //console.log('this.state.ListUsers:', this.state.ListUsers);
        //console.log('this.state.ListGroups:', this.state.ListGroups);
        //console.log('this.state.ListShowGroup:', this.state.ListShowGroup);
      })
      .catch(err => {
        console.log('err: ', err);
      });
  };

  onOpenSearchBar() {
    this.setState({isSearchBar: true});
  }

  UpdateGroupSelected = NameGroupSelected => {
    var ListShowGroup = this.state.ListShowGroup;
    var ListUserShow = [];
    var idChoose = null;
    //console.log('NameGroupSelected: ', NameGroupSelected);
    if (ListShowGroup[NameGroupSelected] === 'ALL') {
      //console.log('NameGroupSelected === ALL');
      this.setState({
        NameGroupSelected: NameGroupSelected,
        ListUserShow: this.state.ListUsers,
        isSearchBar: false,
        search: null,
        arrayHolder: this.state.ListUsers,
      });
    } else {
      //console.log('NameGroupSelected != ALL');

      this.state.ListGroups.forEach(function(itm) {
        //console.log('itm.groupname: ', itm.groupname);
        if (ListShowGroup[NameGroupSelected] === itm.groupname.toString()) {
          idChoose = itm.groupid;
        }
      });

      this.state.ListUsers.forEach(function(item) {
        if (item.groupid === idChoose) {
          ListUserShow.push(item);
        }
      });

      this.setState({
        NameGroupSelected: NameGroupSelected,
        ListUserShow: ListUserShow,
        isSearchBar: false,
        search: null,
        arrayHolder: ListUserShow,
      });
    }
  };

  renderItem = ({item}) => {
    //console.log('this.state.ListUserShow1111:', this.state.ListUserShow);
    //console.log('item Render: ', item);
    return (
      <TouchableOpacity
        style={{
          height: 50,
          width: undefined,
          borderColor: 'gray',
          borderWidth: 1,
          justifyContent: 'center',
        }}
        onPress={() =>
          this.props.navigation.navigate('NewItem', {
            User_Item_id: item.username,
          })
        }>
        <Text
          style={{
            fontSize: 25,
            paddingLeft: 50,
          }}>
          {item.username}
        </Text>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <Container>
        <Content>
          <View style={styles.HeaderSearch}>
            <View
              style={{
                justifyContent: 'flex-start',
                flexDirection: 'row',
                backgroundColor: '#000',
              }}>
              <Picker
                style={{
                  height: 60,
                  color: '#fff',
                  width: 150,
                }}
                mode="dropdown"
                selectedValue={this.state.NameGroupSelected}
                onValueChange={this.UpdateGroupSelected}>
                {this.state.ListShowGroup.map((item, index) => {
                  return <Picker.Item label={item} value={index} key={index} />;
                })}
              </Picker>
              <Image source={white_down} style={styles.pickerButton} />
            </View>
            <View
              style={{
                flex: 1,
              }}>
              {this.state.isSearchBar ? (
                <SearchBar
                  style={{
                    flex: 1,
                    alignSelf: 'flex-end',
                    paddingRight: 10,
                    height: 40,
                  }}
                  onChangeText={this.updateSearch}
                  value={this.state.search}
                  autoFocus={true}
                />
              ) : (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignSelf: 'flex-end',
                    paddingRight: 10,
                  }}
                  onPress={() => this.onOpenSearchBar()}>
                  <Image source={search_white} style={styles.searchButton} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <FlatList
            data={this.state.ListUserShow}
            renderItem={this.renderItem}
            extraData={this.state}
          />
        </Content>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  HeaderSearch: {
    height: 60,
    width: undefined,
    backgroundColor: '#000',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  searchButton: {
    height: 30,
    width: 30,
  },
  pickerButton: {
    height: 15,
    width: 15,
    alignSelf: 'center',
  },
  picker: {
    flexDirection: 'row',
  },
});
