import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import * as Define from '../components/locales/Language.json';
import HeaderForm from '../containers/Header';
import FooterCamera from '../components/form/FooterCamera';
import {
  Container,
  Header,
  Content,
  Footer,
  FooterTab,
  Button,
} from 'native-base';
export default class SearchScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  render() {
    return (
      <Container>
        <HeaderForm
          actionOnPressLeft={() => this.props.navigation.openDrawer()}
          actionOnPressRight={() => this.props.navigation.navigate('User')}
        />
        <Content>
          <Text> SearchScreen </Text>
        </Content>
        <Footer style={styles.back}>
          <FooterCamera
            actionOnPressBackItem={() =>
              this.props.navigation.navigate('NewItem')
            }
            style={{flex:1}}
          />
        </Footer>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  back:{
    backgroundColor: '#F5FCFF',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});