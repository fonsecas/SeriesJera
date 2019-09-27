import React, { Component } from 'react';
import {
	View,
	TextInput,
	Text,
	StyleSheet,
	ActivityIndicator,
	Alert,
	Image,
	AsyncStorage,
	Keyboard,
	TouchableWithoutFeedback,
	KeyboardAvoidingView,
	ToastAndroid
} from 'react-native';
import styles from "./style";
import firebase from 'firebase';
import { connect } from 'react-redux';
import { tryLogin } from '../../actions';
import FormRow from '../../components/FormRow';
import { Button } from 'react-native-elements';
import * as Facebook from 'expo-facebook';

class LoginPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			mail: '',
			password: '',
			isLoading: false,
			message: ''
		}
	}

	onChangeHandler(field, value) {
		this.setState({
			[field]: value
		});
	}

	//Função para de atutenticação do usuario
	tryLogin() {
		this.setState({ isLoading: true, message: '' });
		const { mail: email, password } = this.state;

		this.props.tryLogin({ email, password })
			.then(user => {
				if (user)

					(async () => {

						await AsyncStorage.setItem('token9', JSON.stringify({ 'email': email, 'password': password }))
					})()

				return this.props.navigation.navigate('App', { user: user });

				this.setState({
					isLoading: false,
					message: ''
				});
			})
			.catch(error => {
				this.setState({
					isLoading: false,
					message: this.getMessageByErrorCode(error.code)
				});
			});
	}

	//Função para tratar erro das mensagens no Login do Usuario
	getMessageByErrorCode(errorCode) {
		console.log(errorCode)
		switch (errorCode) {
			case 'auth/wrong-password':
				return 'Senha incorreta';
			case 'auth/user-not-found':
				return 'Usuário não encontrado';
			case 'auth/invalid-email':
				return 'Insira um e-mail válido'
			default:
				return 'Erro desconhecido';
		}
	}
	//Função para renderizar a mensagem de erro ao usuario
	renderMessage() {
		const { message } = this.state;
		if (!message)
			return null;

		return (
			<View>
				<Text style={{color: 'red', textAlign: 'center', marginTop: 10, marginBottom: 10}}>{message}</Text>
			</View>
		);
	}
	//Renderiza  o ActivityIndicator do Botão Login
	renderButton() {
		if (this.state.isLoading)
			return <ActivityIndicator />;
		return (
			<Button
				buttonStyle={styles.loginButton}
				title="Login"
				onPress={() => this.tryLogin()} />
		);
	}
	logIn = async () => {
	
		  const {
			type,
			token,
			expires,
			permissions, 
			declinedPermissions,
		  } = await Facebook.logInWithReadPermissionsAsync('2662826547095358', {
			permissions: ['public_profile', 'email'],
		  });
		  if (type === 'success') {
			// Get the user's name using Facebook's Graph API 
			const response = await fetch('https://graph.facebook.com/v2.5/me?fields=email,id,name&access_token=' + token)
			.then((response) => response.json())
			.then((json) => {
				const credential = firebase.auth.FacebookAuthProvider.credential(token); 

					console.log('rspondese', json)
					console.log('cdredencital', credential) 
						// Sign in with credential from the Facebook user.
					firebase.auth().signInWithCredential(credential).catch((error) => {
						console.log(error)
						}); 
						
					const { currentUser } =  firebase.auth(); 
					console.log(currentUser)
					firebase
							.database()
							.ref(`/users/${currentUser.uid}/perfil/`)
							.set({'nome': currentUser.displayName})
							.then(() => {
								(async () => {

									await AsyncStorage.setItem('token9', JSON.stringify({ 'token': token}))
								})()
							}) 
							 
					
 
				return this.props.navigation.navigate('App');	
					
			})
			.catch(() => {
			  reject('ERROR GETTING DATA FROM FACEBOOK') 
			})
			
		  } else { 
			// type === 'cancel'
		  }
		 
	  }
	render() {
		(async () => { await AsyncStorage.clear() })()
		return (
			<KeyboardAvoidingView style={styles.containerView} behavior="padding">

				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<View style={styles.loginScreenContainer}>
						<View style={styles.loginFormView}>
							<Text style={styles.logoText}>PraVerDepois</Text>
							<TextInput
								style={styles.loginFormTextInput}
								placeholder="user@mail.com" 
								value={this.state.mail}
								onChangeText={value => this.onChangeHandler('mail', value)}
								keyboardType="email-address"
								autoCapitalize="none"
							/>
							<TextInput
								style={styles.loginFormTextInput}
								placeholder="******"
								secureTextEntry
								value={this.state.password}
								onChangeText={value => this.onChangeHandler('password', value)}
							/>

							{ this.renderMessage()} 

							{this.renderButton()}
							<Button
							buttonStyle={styles.loginButton}
							title="Criar Conta"
							onPress={() => this.props.navigation.navigate('RegisterPage')}/>
							
							<Button
								//buttonStyle={styles.fbLoginButton}
									buttonStyle={{marginTop: 100}} 
									titleStyle={{color:'white'}}
								onPress={() => this.logIn()}
								title="Login with Facebook"
								type="clear"
								//color="#3897f1"
							/>
						</View>
					</View>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		)
	}
	componentDidMount() {
	}
  
	componentWillUnmount() {
	}
  
	onLoginPress() {
  
	}
	
}



export default connect(null, { tryLogin })(LoginPage)


