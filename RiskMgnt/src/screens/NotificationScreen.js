import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import * as Define from '../components/locales/Language.json';
import HeaderForm from '../containers/Header';

export default class NotificationScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      header: (
        <HeaderForm
          title={Define.NEW_ITEM}
          actionOnPressRight={() =>
            navigation.navigate('User', {
              SCREEN_NAVIGATE: 'Notification',
            })
          }
          actionOnPressLeft={() => navigation.openDrawer()}
        />
      ),
    };
  };
  render() {
    return (
      <View style={styles.container}>
        <Text>NotificationScreen</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
