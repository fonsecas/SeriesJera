import React from 'react';
import  {StyleSheet, View, Text, TextInput, Button, ActivityIndicator } from 'react-native';
import FormRow from '../components/FormRow';
import firebase from 'firebase';

export default class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mail: '',
            password: '',
            isLoading: false,
            message: '',
        }
    }

    componentDidMount() {
        var config = {
                apiKey: "AIzaSyANrg7BYCCXpkT9zo6Mb3CG_BuBc1AfdkU",
                authDomain: "seriesjera2019.firebaseapp.com",
                databaseURL: "https://seriesjera2019.firebaseio.com",
                projectId: "seriesjera2019",
                storageBucket: "",
                messagingSenderId: "750035580453",
                appId: "1:750035580453:web:19ab5f51ba30efef92b1cc"
              };
              // Initialize Firebase
              firebase.initializeApp(config);
        }
    

    onChangeHandler(field, value ){ 
        this.setState({
            [field]: value
        })
    }
    tryLogin(){
        this.setState({isLoading: true})
        const {mail, password} = this.state;

        firebase
        .auth()
        .signInWithEmailAndPassword(mail,password)
        .then(user=> {
            console.log("usuario autenticado")
        })
        .catch(error =>{
            this.setState({message: this.getMEssageByErrorCode(error.code)})

        })
        .then(() => this.setState({isLoading: false}))
    }
    renderButton() {
        if (this.state.isLoading)
            return <ActivityIndicator/>;
            
        return (
        <Button 
                    title="Entrar"
                    onPress={() => this.tryLogin() }/>
        )
    }
    getMEssageByErrorCode(errorCode) {
        switch (errorCode){
            case 'auth/wrong-password':
                return 'Senha Invalida';
            case 'auth/user-not-found':
                return 'Usuario não encontrado';
            default:
                    return 'Erro desconhecido'
        }
    }
    rederMessage() {
        const {message} = this.state;

        if(!message)
            return null

        return (
            <View>
                <Text>{message}</Text>
            </View>
         )
    }

    render(){
        return (
            <View style={styles.container}>
                <FormRow first>
                    <TextInput 
                        style={styles.input}
                        placeholder="user@mail.com"
                        value={this.state.mail}
                        onChangeText={value => this.onChangeHandler('mail', value)}
                    />
                </FormRow>
                <FormRow last>
                    <TextInput 
                        style={styles.input}
                        placeholder="********"
                        secureTextEntry
                        value={this.state.password}
                        onChangeText={value => this.onChangeHandler('password', value)}


                    />
                </FormRow>

                { this.renderButton() }
                { this.rederMessage() }
                
            </View>
        )
    }
} 

const styles = StyleSheet.create({
    container: {
        paddingLeft: 10,
        paddingRight: 10
    },
    input: {
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 5,
    }
})