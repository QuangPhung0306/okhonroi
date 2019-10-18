/* eslint-disable react/react-in-jsx-scope */
import React, {Component} from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {
  createDrawerNavigator,
  DrawerNavigatorItems,
} from 'react-navigation-drawer';
import RNFetchBlob from 'rn-fetch-blob';

import {
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';

import CustomDrawer from '../navigator/CustomDrawer';

import HomeScreen from '../../screens/HomeScreen';
import MapScreen from '../../screens/MapScreen';
import NotificationScreen from '../../screens/NotificationScreen';
import InforUserScreen from '../../screens/InforUserScreen';
import NewItemScreen from '../../screens/NewItemScreen';
import SearchScreen from '../../screens/SearchScreen';
import PickImage from '../../screens/PickImageScreen';
import CameraPage from '../../screens/CameraPageScreen';
import SettingScreen from '../../screens/SettingScreen';
import ChooseUserScreen from '../../screens/ChooseUserScreen';
import DetailItemsScreen from '../../screens/DetailItemsScreen';

const HomeStack = createStackNavigator({
  Home: {screen: HomeScreen},
  User: {screen: InforUserScreen},
  NewItem: {screen: NewItemScreen},
  Map: {screen: MapScreen},
  Search: {screen: SearchScreen},
  PickImage: {screen: PickImage},
  Camera: {screen: CameraPage},
  Notification: {screen: NotificationScreen},
  Setting: {screen: SettingScreen},
  ChooseUser: {screen: ChooseUserScreen},
  DetailItem: {screen: DetailItemsScreen},
});

const AppNavigation = createDrawerNavigator(
  {
    HomeStack,
  },
  {
    contentComponent: props => <CustomDrawer {...props} />,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
  },
);

export default AppNavigation;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fcfcfc',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
  container1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
