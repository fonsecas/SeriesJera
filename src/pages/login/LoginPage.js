import React, { Component } from 'react';
import {
	View,
	TextInput,
	Text,
	StyleSheet,
	ActivityIndicator,
	Alert,
	AsyncStorage,
	Keyboard,
	TouchableWithoutFeedback,
	KeyboardAvoidingView
} from 'react-native';
import styles from "./style";
import firebase from 'firebase';
import { connect } from 'react-redux';
import { tryLogin } from '../../actions';
import FormRow from '../../components/FormRow';
import { Button } from 'react-native-elements'

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
		switch (errorCode) {
			case 'auth/wrong-password':
				return 'Senha incorreta';
			case 'auth/user-not-found':
				return 'Usuário não encontrado';
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
				<Text>{message}</Text>
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

	render() {
		(async () => { await AsyncStorage.clear() })()
		return (
			<KeyboardAvoidingView style={styles.containerView} behavior="padding">

				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<View style={styles.loginScreenContainer}>
						<View style={styles.loginFormView}>
							<Text style={styles.logoText}>Jera Series</Text>
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
							{this.renderButton()}
							<Button
							buttonStyle={styles.loginButton}
							title="Criar Conta"
							onPress={() => this.props.navigation.navigate('RegisterPage')}/>
							{ this.renderMessage()} 
							<Button
								//buttonStyle={styles.fbLoginButton}
									buttonStyle={{marginTop: 100}}
								onPress={() => this.onFbLoginPress()}
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
  
	async onFbLoginPress() {
	  const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(appId, {
		permissions: ['public_profile', 'email'],
	  });
	  if (type === 'success') {
		const response = await fetch(
		  `https://graph.facebook.com/me?access_token=${token}`);
		Alert.alert(
		  'Logged in!',
		  `Hi ${(await response.json()).name}!`,
		);
	  }
	}
}



export default connect(null, { tryLogin })(LoginPage)


