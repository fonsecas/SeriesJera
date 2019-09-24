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
import { registerNewUser } from '../../actions';
import FormRow from '../../components/FormRow'; 
import DatePicker from 'react-native-datepicker';

class RegisterPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mail: '',
			password: '', 
			isLoading: false,
			message: '',
			date:""
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
		const { mail: email, password, dataNascimento, nome  } = this.state;

		this.props.registerNewUser({ email, password, nome, dataNascimento })
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
				title="Cadastrar"
				onPress={() => this.registerNewUser()}/>
		);
	}

	render() {
		
		return (
			<View style={styles.container}>
				<FormRow first>
					<TextInput
						style={styles.input}
						placeholder="Qual seu nome ?"
						value={this.state.nome}
						onChangeText={value => this.onChangeHandler('nome', value)}
						autoCapitalize="none"
					 />
				</FormRow>
				<FormRow>
				<DatePicker
							style={{width: '100%'}}
							date={this.state.date} 
							format="DD-MM-YYYY"
							mode="date"
							placeholder="Que dia você nasceu ?"
							customStyles={{dateInput:{borderWidth: 0}}}
							onDateChange={(date) => {this.onChangeHandler('dataNascimento', date)}}
							/>
				</FormRow>
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


export default connect(null, { registerNewUser })(RegisterPage)

    
