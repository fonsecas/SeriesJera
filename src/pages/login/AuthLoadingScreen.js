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

    constructor() {
        super()
        this.loadApp()
    }
    loadApp = async () => {

        const getUserToken = await AsyncStorage.getItem('token9')
        const userToken = JSON.parse(getUserToken)
        if (userToken) {
            if (userToken.token) {
                const credential = firebase.auth.FacebookAuthProvider.credential(userToken.token);
                await firebase.auth().signInWithCredential(credential).catch((error) => {
                    console.log(error)
                })
            } else {

                let email = userToken.email.toString();
                let password = userToken.password.toString()
                await firebase
                    .auth()
                    .signInWithEmailAndPassword(email, password)
                    .then(() => {
                        console.log('usuario logado')

                    })
            }

        }
        this.props.navigation.navigate(userToken ? 'App' : 'Auth')

    }

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator />
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