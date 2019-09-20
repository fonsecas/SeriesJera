import { createAppContainer} from 'react-navigation';
import LoginPage from './pages/LoginPage';
import SeriesPage from './pages/SeriesPage'
import SerieDetailPage from './pages/SerieDetailPage'
import { createStackNavigator } from 'react-navigation-stack';


const AppNavigator = createStackNavigator({
  'Main':{
      screen: SeriesPage
  },
  'Login':{
    screen: LoginPage, 
    navigationOptions: {
      title: 'Bem vindo', 
    }    
  }, 
  'SerieDetail':{
    screen: SerieDetailPage,
    navigationOptions: ({navigation}) => {
      const { serie } = navigation.state.params;
      return {
        title: serie.title
      }
    }
},
  
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