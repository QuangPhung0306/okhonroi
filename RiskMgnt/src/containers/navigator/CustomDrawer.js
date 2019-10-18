import React, {Component} from 'react';
import * as Define from '../../components/locales/Define.json';
import * as Language from '../../components/locales/Language.json';

import RNFetchBlob from 'rn-fetch-blob';
import {
  View,
  Text,
  StyleSheet,
  AsyncStorage,
  TouchableOpacity,
  Platform,
  Switch,
} from 'react-native';

export default class CustomComponent extends Component {
  _onPressButton = async () => {
    console.log('OK LogOut Pressed');
    var uri = Define.API_PATH + Define.LOGOUT;
    let UserToken = await AsyncStorage.getItem('UserToken');
    var Authorization = 'Bearer ' + UserToken;
    RNFetchBlob.fetch('POST', uri, {
      Authorization: Authorization,
      'Content-Type': 'application/x-www-form-urlencoded',
    })
      .then(resp => {
        var tempMSG = resp.data;
        console.log('tempMSG: ', tempMSG);
        var Obj = JSON.parse(tempMSG);
        if (Obj.message != null) {
          this.OnLogOut();
        }
      })
      .catch(err => {
        console.log(err);
        // ...
      });
  };

  OnLogOut = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('AuthLoading');
  };

  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.containerBottom}>
          <TouchableOpacity
            onPress={() => navigate('Home')}
            style={styles.containerBottomItem}>
            <View style={styles.button}>
              <Text style={styles.txtBottom}>{Language.HOME}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigate('Notification')}
            style={styles.containerBottomItem}>
            <View style={styles.button}>
              <Text style={styles.txtBottom}>{Language.NOTIFICATION}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigate('Setting')}
            style={styles.containerBottomItem}>
            <View style={styles.button}>
              <Text style={styles.txtBottom}>{Language.SETTING}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigate('help')}
            style={styles.containerBottomItem}>
            <View style={styles.button}>
              <Text style={styles.txtBottom}>{Language.HELP}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this._onPressButton}
            style={styles.containerBottomItem}>
            <View style={styles.button}>
              <Text style={styles.txtBottom}>{Language.LOGOUT}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containertopRow: {
    marginTop: 10,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtBottom: {
    marginLeft: 10,
    color: '#000',
    fontSize: 20,
    fontWeight: '100',
  },
  imageTopRow: {
    height: 80,
    width: 80,
    ...Platform.select({
      ios: {
        borderRadius: 80 / 2,
      },
      android: {
        borderRadius: 80,
      },
    }),
  },
  icon: {
    height: 25,
    width: 25,
    marginRight: 10,
  },
  button: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  containertopRowText: {
    flexDirection: 'column',
    marginLeft: 5,
  },

  containerBottom: {
    backgroundColor: '#fff',
  },

  containerBottomItem: {
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderBottomColor: '#000',
    borderBottomWidth: 0.5,
  },
});
