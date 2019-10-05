import React from 'react';
import {
	View,
	TextInput,
	Text,
	StyleSheet,
	ActivityIndicator,
	Alert,
	AsyncStorage
} from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { registerNewUser } from '../../actions';
import FormRow from '../../components/FormRow';
import DatePicker from 'react-native-datepicker';
import styles from "./style";
import { Button } from 'react-native-elements'


class RegisterPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mail: '',
			password: '',
			isLoading: false,
			message: '',
			date: ""
		}
	}

	onChangeHandler(field, value) {
		this.setState({
			[field]: value
		});
	}

	//Função para de atutenticação do usuario
	registerNewUser() {
		this.setState({ isLoading: true, message: '' });
		const { mail: email, password, dataNascimento, nome } = this.state;

		this.props.registerNewUser({ email, password, nome, dataNascimento })
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
			case 'auth/email-already-in-use':
				return 'E-mail já cadastrado';
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
				<Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>{message}</Text>
			</View>
		);
	}
	//Renderiza  o ActivityIndicator do Botão Login
	renderButton() {
		if (this.state.isLoading)
			return <ActivityIndicator />;
		return (
			<Button
				buttonStyle={{
					marginLeft: 15,
					marginRight: 15,
					backgroundColor: '#D32F2F',
					borderRadius: 5,
					height: 45,
					marginTop: 10
				}}
				title="Cadastrar"
				onPress={() => this.registerNewUser()} />
		);
	}

	render() {

		return (
			<View style={style.container}>
				<TextInput
					style={styles.loginFormTextInput}
					placeholder="Qual seu nome ?"
					value={this.state.nome}
					onChangeText={value => this.onChangeHandler('nome', value)}
					autoCapitalize="none"
				/>
				<DatePicker
					style={{
						height: 43,
						fontSize: 14,
						borderRadius: 5,
						borderWidth: 1,
						borderColor: '#eaeaea',
						backgroundColor: '#fafafa',
						paddingLeft: 10,
						marginLeft: 15,
						marginRight: 15,
						marginTop: 5,
						marginBottom: 5,
						width: '93%'
					}}
					date={this.state.dataNascimento}
					format="DD-MM-YYYY"
					mode="date"
					placeholder="Que dia você nasceu ?"
					showIcon={false}
					customStyles={{ dateInput: { borderWidth: 0, alignItems: "flex-start" } }}
					onDateChange={(date) => { this.onChangeHandler('dataNascimento', date) }}
				/>
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
				{this.renderMessage()}
			</View>
		)
	}
}

const style = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 30,
		paddingLeft: 10,
		paddingRight: 10,
		backgroundColor: '#263238'
	},
	input: {
		paddingLeft: 5,
		paddingRight: 5,
		paddingBottom: 5,
	},
});


export default connect(null, { registerNewUser })(RegisterPage)


