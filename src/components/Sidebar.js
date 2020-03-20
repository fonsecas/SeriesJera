import React, { Component } from "react";
import { StyleSheet, View, ScrollView, Image, ImageBackground, SafeAreaViewComponent, AsyncStorage, Text, TouchableOpacity, ToastAndroid, SafeAreaView, Platform } from 'react-native';
import { DrawerNavigatorItems } from 'react-navigation-drawer';
import Moment from 'moment';
import firebase from 'firebase'
import { Icon } from 'react-native-elements'

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      userDetail: {}
    };
    this.json = {}
  }
  componentDidMount() {
    this.getUserPerfil();
  }

  getUserPerfil = async () => {
    const { currentUser } = firebase.auth();
    await firebase
      .database()
      .ref(`/users/${currentUser.uid}/`)
      .on('value', snapshot => {
        const result = snapshot.val()
        const { perfil } = result
        if (perfil) {
          this.setState({
            userDetail: perfil,
            userInfo: currentUser
          })
        } else {
          this.setState({ userDetail: [] })

        }
      })
  }
  logoutUser() {
    firebase.auth().signOut().then(() => {

      this.props.navigation.navigate('LoginPage')

    }).catch(function (error) {
      // An error happened.
    });
  }
  render() {
    return (

      <View style={{ flex: 1, backgroundColor: "#263238" }}>

        <View style={{ height: 180, alignItems: 'center', justifyContent: 'center', backgroundColor: '#D32F2F' }}>
          <TouchableOpacity>
            <Image source={this.state.userInfo.photoURL ? { uri: `${this.state.userInfo.photoURL}?type=large` } : require('../img/default-user.png')} style={{ borderWidth: 2, borderColor: 'white', height: 60, width: 60, borderRadius: Platform.OS === "ios" ? 10 : 60 }} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, color: 'white', marginTop: 5 }}>{this.state.userDetail.nome}</Text>
          <Text style={{ fontSize: 12, color: 'white', marginTop: 5 }}>{this.state.userInfo.email}</Text>

        </View>

        <ScrollView>

          <DrawerNavigatorItems {...this.props} />
          <View
            style={{
              borderBottomColor: '#E5E5E5',
              borderBottomWidth: 1
            }} />
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Estatísticas')}>
            <View style={styles.item}>
              <View style={styles.iconContainer}>
                <Icon name='cog' type='font-awesome' color='white' />
              </View>
              <Text style={styles.label}>Configurações</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.logoutUser()}>

            <View style={styles.item}>
              <View style={styles.iconContainer}>
                <Icon name='exit-to-app' type='material' color='white' />
              </View>
              <Text style={styles.label}>Sair</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    margin: 16,
    color: 'white',
  },
  iconContainer: {
    marginHorizontal: 16,
    width: 24,
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  }
});
export default SideBar;