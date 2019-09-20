import firebase from 'firebase';

const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
const userLoginSuccess = user => ({
        type: USER_LOGIN_SUCCESS,
        user
});

const USER_LOGOUT = 'USER_LOGOUT';
const userLogout = () => ({
        type: USER_LOGOUT,
        
});

const tryLogin = ({email, password}) => dispatch => {
    firebase
        .auth()
        .signInWithEmailAndPassword(email,password)
        .then(user=> {
            const action = userLoginSuccess(user);
            dispatch(action);
        }) 
        .catch(error =>{
            this.setState({message: this.getMEssageByErrorCode(error.code)})

        })
        .then(() => this.setState({isLoading: false}))
}
