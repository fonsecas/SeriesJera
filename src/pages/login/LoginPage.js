import React from 'react';
import {
	View,
	TextInput,
	Text,
	StyleSheet,
	Button,
	ActivityIndicator,
	Alert,
	AsyncStorage
} from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { tryLogin } from '../../actions';
import FormRow from '../../components/FormRow'; 

class LoginPage extends React.Component {
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

					(async() => {

						await AsyncStorage.setItem('token9', JSON.stringify({'email': email, 'password' :password }))})()

					return this.props.navigation.navigate('App', { user : user });

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
				title="Entrar"
				onPress={() => this.tryLogin()}/>
		);
	}

	render() {
		(async() => {await AsyncStorage.clear()})()
		return (
			<View style={styles.container}>
				<FormRow first>
					<TextInput
						style={styles.input}
						placeholder="user@mail.com"
						value={this.state.mail}
						onChangeText={value => this.onChangeHandler('mail', value)}
						keyboardType="email-address"
						autoCapitalize="none"
					 />
				</FormRow>
				<FormRow last>
					<TextInput
						style={styles.input}
						placeholder="******"
						secureTextEntry
						value={this.state.password}
						onChangeText={value => this.onChangeHandler('password', value)}
					/>
				</FormRow>

				{ this.renderButton() }
				{ this.renderMessage() }
				<Button
				title="Criar Conta"
				onPress={() => this.props.navigation.navigate('RegisterPage')}/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		paddingLeft: 10,
		paddingRight: 10,
	},
	input: {
		paddingLeft: 5,
		paddingRight: 5,
		paddingBottom: 5,
	},
});


export default connect(null, { tryLogin })(LoginPage)

    
