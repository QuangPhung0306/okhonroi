import React, {Component} from 'react';
import {StyleSheet, Text, View, AsyncStorage} from 'react-native';
import * as Define from '../components/locales/Language.json';
import * as API from '../components/locales/Define.json';
import HeaderForm from '../containers/Header';
import FooterCamera from '../components/form/FooterCamera';
import {
  Container,
  Header,
  Content,
  Footer,
  FooterTab,
  Button,
  Item,
} from 'native-base';
import * as Language from '../components/locales/Language.json';
import RNFetchBlob from 'rn-fetch-blob';
export default class SearchScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor() {
    super();
    this.state = {
      username: '',
      mailAddress: '',
      groupName: '',
      companyName: '',
    };
  }
  componentDidMount() {
    this.getUserData();
  }

  getUserData = async () => {
    var groupIDCopy = null;

    let UserToken = await AsyncStorage.getItem('UserToken');

    const retrievedItemUser = await AsyncStorage.getItem('DataUser');
    const retrievedItemCompany = await AsyncStorage.getItem('DataCompany');
    const itemCompany = JSON.parse(retrievedItemCompany);
    const item = JSON.parse(retrievedItemUser);
    console.log('item User: ', item);
    console.log('item Company: ', itemCompany);
    var uri = API.API_PATH + API.GET_GROUP_INFOR + item.companyid.toString();
    console.log('uri: ', uri);
    var Authorization = 'Bearer ' + UserToken;

    RNFetchBlob.fetch('GET', uri, {
      Authorization: Authorization,
      'Content-Type': 'application/x-www-form-urlencoded',
    })
      .then(resp => {
        var tempMSG = resp.data;
        var jsonObj = JSON.parse(tempMSG);
        console.log('jsonObj: ', jsonObj);
        jsonObj.forEach(function(itm) {
          if (item.groupid === itm.groupid) {
            groupIDCopy = itm.groupname;
            console.log('groupIDCopy: ', groupIDCopy);
          }
        });
        this.setState({
          username: item.username,
          mailAddress: item.mailaddress,
          groupName: groupIDCopy,
          companyName: itemCompany.companyname,
        });
      })
      .catch(err => {
        console.log('err: ', err);
      });
    console.log('username:', this.state.username);
    console.log('mailAddress:', this.state.mailaddress);
    console.log('groupName:', this.state.groupName);
    console.log('companyName:', this.state.companyName);
  };
  render() {
    const ScreenNavigate = this.props.navigation.getParam('SCREEN_NAVIGATE');
    return (
      <Container>
        <HeaderForm
          actionOnPressLeft={() => this.props.navigation.openDrawer()}
          //actionOnPressRight={() => this.props.navigation.navigate('User')}
        />
        <Content>
          <View style={styles.container}>
            <View style={styles.StyleView}>
              <Text style={styles.StyleText}> {Language.USERNAME} </Text>
              <Text style={styles.StyleText1}> {this.state.username}</Text>
            </View>
            <View style={styles.StyleView}>
              <Text style={styles.StyleText}> {Language.NAMEGROUP} </Text>
              <Text style={styles.StyleText1}> {this.state.groupName}</Text>
            </View>
            <View style={styles.StyleView}>
              <Text style={styles.StyleText}> {Language.NAMEENTERPRISE} </Text>
              <Text style={styles.StyleText1}> {this.state.companyName}</Text>
            </View>
            <View style={styles.StyleView}>
              <Text style={styles.StyleText}> {Language.MAILADRESS} </Text>
              <Text style={styles.StyleText1}> {this.state.mailAddress}</Text>
            </View>
          </View>
        </Content>
        <Footer style={styles.back}>
          <FooterCamera
            actionOnPressBackItem={() =>
              this.props.navigation.navigate(ScreenNavigate)
            }
            style={{flex: 1}}
          />
        </Footer>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingLeft: 20,
    justifyContent: 'space-around',
  },
  back: {
    backgroundColor: '#F5FCFF',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  StyleView: {
    padding: 20,
  },
  StyleText: {
    fontSize: 20,
  },
  StyleText1: {
    paddingLeft: 30,
    fontSize: 20,
  },
});
