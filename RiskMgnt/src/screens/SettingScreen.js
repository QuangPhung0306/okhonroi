import React, {Component} from 'react';
import {StyleSheet, Text, View, Switch} from 'react-native';
import * as Define from '../components/locales/Language.json';
import HeaderForm from '../containers/Header';
import {Container, Content, Footer} from 'native-base';
import FooterCamera from '../components/form/FooterCamera';
import * as Language from '../components/locales/Language.json';
export default class SettingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {switchValue: false};
  }
  static navigationOptions = ({navigation}) => {
    return {
      header: (
        <HeaderForm
          title={Define.NEW_ITEM}
          actionOnPressRight={() =>
            navigation.navigate('User', {
              SCREEN_NAVIGATE: 'Setting',
            })
          }
          actionOnPressLeft={() => navigation.openDrawer()}
        />
      ),
    };
  };
  toggleSwitch = value => {
    this.setState({switchValue: value});
  };
  render() {
    return (
      <Container>
        <Content>
          <View style={styles.container}>
            <Text style={styles.txtBottom}>{Language.SETTING}</Text>
            <View style={styles.Switch}>
              <View style={styles.button}>
                <Text style={styles.txtBottom}>{Language.NOTIFICATION}</Text>
              </View>

              <Switch
                onValueChange={this.toggleSwitch}
                value={this.state.switchValue}
              />
            </View>
          </View>
        </Content>
        <Footer>
          <FooterCamera
            actionOnPressBackItem={() => this.props.navigation.navigate('Home')}
          />
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  Switch: {
    padding: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  txtBottom: {
    marginLeft: 10,
    color: '#000',
    fontSize: 20,
    fontWeight: '100',
    alignSelf: 'center',
  },
});
