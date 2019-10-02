const React = require("react-native");

const { StyleSheet } = React;

export default {

containerView: {
 // alignItems: 'center',
  flex: 1,
  //justifyContent: 'center',
  backgroundColor: '#3897f1',
  
  
},
loginScreenContainer: {
  flex: 1,
},
logoText: {
  fontSize: 40,
  fontWeight: "800",
  marginTop: 150,
  marginBottom: 30,
  textAlign: 'center',
  color: 'white'
},
loginFormView: {
  flex: 1
},
loginFormTextInput: {
  height: 43,
  fontSize: 14,
  borderRadius: 5,
  borderWidth: 1,
  borderColor: '#eaeaea',
  backgroundColor: '#fafafa',
  color: '#757575',
  paddingLeft: 10,
  marginLeft: 15,
  marginRight: 15,
  marginTop: 5,
  marginBottom: 5,

},
loginButton: {
  marginLeft: 15,
  marginRight: 15,
  backgroundColor: '#3F51B5',
  borderRadius: 5,
  height: 45,
  marginTop: 10,
},
fbLoginButton: {
  height: 45,
  marginTop: 10,
  color: '#303F9F', 
},
};