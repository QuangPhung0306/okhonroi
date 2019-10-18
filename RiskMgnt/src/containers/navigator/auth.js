import {createStackNavigator} from 'react-navigation-stack';
import LoginScreen from '../../screens/LoginScreen';

const AuthNavigation = createStackNavigator(
  {
    Login: {screen: LoginScreen},
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none',
  },
);

export default AuthNavigation;
