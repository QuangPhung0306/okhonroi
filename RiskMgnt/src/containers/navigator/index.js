import {createAppContainer, createSwitchNavigator} from 'react-navigation';

import AuthNavigation from './auth';
import AppNavigation from './navigator';
import AuthLoadingScreen from '../../screens/AuthLoadingScreen';

const SwitchNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Auth: AuthNavigation,
    App: AppNavigation,
  },
  {
    initialRouteName: 'AuthLoading',
  },
);

const AppContainer = createAppContainer(SwitchNavigator);

export default AppContainer;
