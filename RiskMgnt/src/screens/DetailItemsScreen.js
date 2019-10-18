import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import * as Define from '../components/locales/Language.json';
import HeaderForm from '../containers/Header';
import {Container, Header, Footer, Content} from 'native-base';
import FooterNewItem from '../components/form/FooterNewItem';
export default class DetailItemsScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      header: (
        <HeaderForm
          title={Define.NEW_ITEM}
          actionOnPressRight={() =>
            navigation.navigate('User', {
              SCREEN_NAVIGATE: 'DetailItem',
            })
          }
          actionOnPressLeft={() => navigation.openDrawer()}
        />
      ),
    };
  };
  render() {
    return (
      <Container>
        <Content>
          <Text> hello </Text>
        </Content>
        <Footer>
          <FooterNewItem
            actionOnPressHome={() => this.props.navigation.navigate('Home')}
            isNewItem={false}
            actionOnPressMap={() =>
              this.props.navigation.navigate('Map', {
                SCREEN_MAP_NAVIGATE: 'DetailItem',
              })
            }
          />
        </Footer>
      </Container>
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
