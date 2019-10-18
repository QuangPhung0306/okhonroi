import React, {Component} from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Alert,
} from 'react-native';

import firebase from 'react-native-firebase';

export default class AuthLoadingScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor() {
    super();
  }

  onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
    console.log('onTokenRefresh: ', fcmToken);
  });

  componentWillUnmount() {
    console.log('componentWillUnmount');
    this.onTokenRefreshListener();
  }

  componentDidMount() {
    this.checkPermission();
  }

  //1
  async checkPermission() {
    firebase
      .messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          console.log('Permission granted');
          this.getToken();
        } else {
          console.log('Request Permission');
          this.requestPermission();
        }
      });
  }

  //2
  async requestPermission() {
    firebase
      .messaging()
      .requestPermission()
      .then(() => {
        this.getToken();
      })
      .catch(error => {
        console.log('permission rejected');
      });
  }

  //3
  async getToken() {
    let FirebaseToken = await AsyncStorage.getItem('FirebaseToken');
    console.log('FirebaseToken Async: ', FirebaseToken);
    if (!FirebaseToken) {
      FirebaseToken = await firebase.messaging().getToken();
      if (FirebaseToken) {
        // this.messageListener();
        // user has a device token
        console.log('after FirebaseToken: ', FirebaseToken);
        try {
          await AsyncStorage.setItem('FirebaseToken', FirebaseToken);
        } catch (error) {
          // Error retrieving data
          console.log('Error set Firebase: ', error.message);
        }
        this.checkTokenUser();
      } else {
        console.log('Login something wrong1 with token');
      }
    } else {
      this.checkTokenUser();
    }
  }
  //4
  async checkTokenUser() {
    this.onTokenRefreshListener();
    let UserToken = await AsyncStorage.getItem('UserToken');
    console.log('before UserToken: ', UserToken);
    if (!UserToken) {
      this.props.navigation.navigate('Auth');
    } else {
      this.props.navigation.navigate('App');
    }
  }

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
