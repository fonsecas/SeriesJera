import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    AsyncStorage
} from 'react-native'
import firebase from 'firebase';
class AuthLoadingScreen extends Component {

    constructor(){
        super()
        this.loadApp()   
    }
    loadApp = async() => {

        const userToken = await AsyncStorage.getItem('token9')
         
       if(userToken){
        var obj = JSON.parse(userToken)
        console.log(obj) 
        let email = obj.email.toString();
        let password = obj.password.toString()
        await firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
               console.log('usuario logado')
               
            })
       }
       this.props.navigation.navigate(userToken ? 'App' : 'Auth')
        
    }

    render () {
        return (
            <View style={styles.container}>
                <ActivityIndicator/>
            </View>
        )
    }
}

export default AuthLoadingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})