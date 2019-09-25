import firebase from 'firebase';
import { Alert } from 'react-native';

export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
const userLoginSuccess = user => ({
	type: USER_LOGIN_SUCCESS,
	user
});

export const USER_LOGOUT = 'USER_LOGOUT';
const userLogout = () => ({
	type: USER_LOGOUT,
});

export const tryLogin = ({ email, password }) => dispatch => {
	return firebase
		.auth()
		.signInWithEmailAndPassword(email, password)
		.then(user => {
			const action = userLoginSuccess(user);
			dispatch(action);
			return user;
		})
		.catch(error => {
			
			return Promise.reject(error)
		})
}

export const registerNewUser = ({ email, password, nome, dataNascimento }) => dispatch => {
	return firebase
		.auth()
		.createUserWithEmailAndPassword(email, password)
		.then(user => {
			const { currentUser } = firebase.auth();
			firebase
					.database()
					.ref(`/users/${currentUser.uid}/perfil/`)
					.set({'nome': nome,
						'dataNascimento': dataNascimento})
					.then(() => {console.log('foi')})

			const action = userLoginSuccess(user);

			dispatch(action);
			return user;
		})
		.catch(error => {		
			return Promise.reject(error)
		})
}