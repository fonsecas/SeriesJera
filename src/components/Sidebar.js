import React, { Component } from "react";
import { StyleSheet, View, ScrollView,  Image, ImageBackground, AsyncStorage, Text, TouchableOpacity,ToastAndroid, SafeAreaView, Platform} from 'react-native';
import {DrawerNavigatorItems } from 'react-navigation-drawer';
import Moment from 'moment';
import firebase from 'firebase'
import {Icon} from 'react-native-elements'
class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      infoClient: {}, 
      userDetail: {}
    };
   this.json = {}
  }
 componentDidMount(){
    this.getUserPerfil();
 }

 getUserPerfil = async () => {
    const {currentUser} = firebase.auth();
    await firebase
    .database()
    .ref(`/users/${currentUser.uid}/`)
    .on('value', snapshot => {
      const result = snapshot.val()
      const {perfil} =  result
      if(perfil){
          console.log(perfil)
        this.setState({userDetail: perfil})
      } else {
        this.setState({userDetail: []}) 

      }
    }) 
 }
 logoutUser()  {
    firebase.auth().signOut().then(() => {
      console.log('desconectado')
      this.props.navigation.navigate('LoginPage') 
      
    }).catch(function(error) {
      // An error happened.
    });
  }
  render() { 
    return (
      
      <View style={{flex: 1, backgroundColor:"white"}}> 
      
      <ImageBackground source={require('../img/background.fw.png')} style={{paddingTop:60,paddingBottom: 10, paddingHorizontal: 10, elevation: 1}}>
        <TouchableOpacity onPress={() =>  ToastAndroid.show(
            'Em breve...',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          )}>
        <Image source={require('../img/default-user.png')} style={{height: 60, width: 60, borderRadius: Platform.OS === "ios" ? 10 : 60 }}/>
        </TouchableOpacity>
        <Text style={{fontSize: 18, color: 'white', marginTop: 5}}>{this.state.userDetail.nome}</Text>
        </ImageBackground>
       
      <ScrollView>
         
        <DrawerNavigatorItems {...this.props}/>
        <TouchableOpacity onPress={() => ToastAndroid.show(
            'Em breve...',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          )}>
        <View style={styles.item}>
        <View style={styles.iconContainer}>
        <Icon name='cog' type='font-awesome' color='#000'/>
                </View>
        <Text style={styles.label}>Configurações</Text>
      </View>
      </TouchableOpacity>
        <View
                        style={{
                        borderBottomColor: '#E5E5E5',
                        borderBottomWidth: 1
                    }}/>
        <TouchableOpacity onPress={() =>  this.logoutUser()}>
        
      <View style={styles.item}>
        <View style={styles.iconContainer}>
        <Icon name='exit-to-app' type='material' color='#000'/>
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
    color: '#222222',
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