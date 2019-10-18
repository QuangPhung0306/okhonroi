/* eslint-disable no-alert */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StatusBar,
  TextInput,
  AsyncStorage,
  Alert,
  Animated,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

import * as Define from '../components/locales/Define.json';
import * as Language from '../components/locales/Language.json';
export default class LoginScreen extends Component {
  state = {
    user: '',
    password: '',
    DataUser: null,
    DataCompany: null,
  };
  handleUserChange = user => {
    this.setState({user});
  };
  handlePasswordChange = password => {
    this.setState({password});
  };

  onLogin = async () => {
    const {user, password} = this.state;
    var DataCompany = null;
    console.debug('onLogin --- start');
    console.log('this.state.DataUser 0: ', this.state.DataUser);
    if (user.length > 0 && password.length > 0) {
      console.log(' Fetch ');
      var uri = Define.API_PATH + Define.AUTH;
      RNFetchBlob.fetch(
        'POST',
        uri,
        {
          Authorization: 'Bearer',
          'Content-Type': 'multipart/form-data',
        },
        [{name: 'mailaddress', data: user}, {name: 'password', data: password}],
      )
        .then(resp => {
          var tempMSG = resp.data;
          console.log('tempMSG: ', tempMSG);
          var obj = JSON.parse(tempMSG);
          console.log('obj: ', obj);
          if (obj.data != null) {
            console.log('this.state.DataUser 1: ', this.state.DataUser);
            obj.data.company.forEach(function(company) {
              if (company.companyid === obj.data.user.companyid) {
                DataCompany = company;
              }
            });
            this.setState({
              DataCompany: DataCompany,
              DataUser: obj.data.user,
            });
            console.log('this.state.DataUser SPH: ', this.state.DataUser);
            console.log('this.state.DataCompany SPH: ', this.state.DataCompany);
            this.SaveUserToken();
          } else {
            Alert.alert(Language.ERR_WRONG_INPUT);
          }
        })
        .catch(err => {
          console.log(err);
          Alert.alert(Language.ERR_DISC);
        });
      console.log('this.state.DataUser 2: ', this.state.DataUser);
    } else {
      Alert.alert(Language.ERR_NOT_INPUT);
    }
  };

  async SaveUserToken() {
    if (this.state.DataUser != null) {
      try {
        await AsyncStorage.setItem(
          'DataUser',
          JSON.stringify(this.state.DataUser),
        );
        await AsyncStorage.setItem('UserToken', this.state.DataUser.user_token);
        await AsyncStorage.setItem(
          'DataCompany',
          JSON.stringify(this.state.DataCompany),
        );
        this.props.navigation.navigate('App');
      } catch (error) {
        console.log('Error set UserToken: ', error.message);
      }
    }
  }

  render() {
    const {user, password} = this.state;
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        keyboardShouldPersistTaps="always"
        style={styles.StyleLogin}>
        <View style={styles.StyleText}>
          <Text style={{fontSize: 20}}> {Language.TITLE_LOGIN} </Text>
          <Text style={{fontSize: 20}}> {Language.USEPASS_LOGIN} </Text>
          <Text style={{fontSize: 20}}> {Language.PLEASE_LOGIN}</Text>
        </View>
        <View style={styles.USerPut}>
          <Text style={{flex: 1, fontSize: 20}}> {Language.USER_ID} </Text>
          <TextInput
            name="user"
            value={user}
            style={styles.input}
            // autoCapitalize="none"
            // autoCorrect={false}
            keyboardType="email-address"
            // returnKeyType="go"
            // placeholder="Email or Mobile Num"
            placeholderTextColor="rgba(225,225,225,0.7)"
            onChangeText={this.handleUserChange}
          />
        </View>
        <View style={styles.USerPut}>
          <Text style={{flex: 1, fontSize: 20}}> {Language.PASS} </Text>
          <TextInput
            name="password"
            value={password}
            style={styles.input}
            // returnKeyType="go"
            // placeholder="Password"
            placeholderTextColor="rgba(225,225,225,0.7)"
            //  secureTextEntry
            onChangeText={this.handlePasswordChange}
          />
        </View>
        <View style={styles.StyleButton}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={this.onLogin}>
            <Text style={styles.buttonText}> {Language.CONFIRM} </Text>
          </TouchableOpacity>
        </View>
        <View>
          <View
            style={{
              borderBottomColor: 'gray',
              borderBottomWidth: 1,
              paddingTop: 40,
              paddingBottom: 5,
              fontSize: 15,
            }}
          />
          <Text style={{alignSelf: 'center', color: 'gray'}}>
            BeforeIncident.2019Ⓒ All Rights Reserved.
          </Text>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 40,
    marginTop: 100,
  },
  buttonContainer: {
    backgroundColor: '#fff',
    //paddingVertical: 10,
    //justifyContent: 'flex-end',
    //paddingLeft: 30,
    borderColor: '#0a0a0a',
    borderWidth: 1,
    height: 35,
    width: 110,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#0a0a0a',

    fontSize: 20,
    alignSelf: 'center',
  },
  input: {
    height: 40,
    //backgroundColor: 'rgba(225,225,225,0.2)',
    marginBottom: 20,
    padding: 5,
    color: '#0a0a0a',
    flex: 1,
    borderColor: '#1f1e1e',
    borderWidth: 1,
    width: 120,
    fontSize: 20,
  },
  USerPut: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  StyleButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 30,
  },
  StyleLogin: {
    flex: 0.7,
    margin: 40,
    marginTop: 100,
  },
  StyleText: {
    paddingBottom: 50,
  },
});
