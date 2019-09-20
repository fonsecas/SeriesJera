import { createAppContainer} from 'react-navigation';
import LoginPage from './pages/LoginPage';
import { createStackNavigator } from 'react-navigation-stack';


const AppNavigator = createStackNavigator({
  'Login':{
    screen: LoginPage,
    navigationOptions: {
      title: 'Bem vindo',
    }
  }
}, {
  defaultNavigationOptions: {
    title: "Series",
    headerTintColor: 'white',
    headerStyle:{
      backgroundColor: '#6ca2f7',
      borderBottomWith: 1,
      borderBottomColor: '#c5c5c5',
    },
    headerTitleStyle:{
      color: 'white',
      fontSize: 30,
    }
  }

})

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;