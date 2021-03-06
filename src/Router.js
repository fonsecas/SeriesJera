import { createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createDrawerNavigator, DrawerActions } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import LoginPage from './pages/login/LoginPage';
import WatchList from './pages/series/WatchList'
import SerieDetail from './pages/series/SerieDetail' 
import React, { Component } from 'react'; 
import WatchedList from './pages/series/WhatchedList'
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native'
import AuthLoadingScreen from './pages/login/AuthLoadingScreen'
import { Icon } from 'react-native-elements'
import MainScreen from './pages/home/MainScreen'
import RegisterPage from './pages/login/RegisterPage'
import SideBar from './components/Sidebar'
import RecomendList from './pages/series/RecomendList'
import GenresList from './pages/series/GenresList'
import UserStats from './pages/profile/UserStats'
import Profile from './pages/profile/Profile'
const AuthStackNavigator = createStackNavigator({
  LoginPage: { 
    screen: LoginPage,
    navigationOptions: {
      header: null,
      title: 'Bem Vindo',
      headerStyle: {
        backgroundColor: "#3897f1",
        color: 'white',
        alignContent: 'center'
      },
      headerTitleStyle: {
        color: 'white'
          }
      
    },
    },
    RegisterPage: { 
      screen: RegisterPage,
      
      navigationOptions: {
        title: 'Criar Conta',
        headerStyle: {
          backgroundColor: "#D32F2F",
          color: 'white',
          elevation: 1
        },
        headerTitleStyle: {
          color: 'white'
            },
        headerTintColor: 'white',
      }
      },

    
  },
  )
const Drawer = createDrawerNavigator(
  {
    Descobrir: { screen: MainScreen, 
              navigationOptions: {
                drawerIcon: ({tintColor}) => (
                  <Icon name="home"  type="material" color={tintColor}/>
                ),
                
              },
            },
    'Para Assistir': { screen: WatchList,     
      navigationOptions: {
        color: 'white',
        drawerIcon: ({tintColor}) => (
          <Icon name="restore" type="material" color={tintColor}/>
        )
      }}, 
      'Já Assisti': { screen: WatchedList,  
        navigationOptions: {
          drawerIcon: ({tintColor}) => (
            <Icon name="visibility" type="material" color={tintColor}/>
          )
        }}, 
        'Estatísticas': { screen: UserStats,  
          navigationOptions: {
            drawerIcon: ({tintColor}) => (
              <Icon name="trending-up" type="material" color={tintColor}/>
            )
          }}, 
      //   'Recomendados pra mim': { screen: RecomendList,  
      //     navigationOptions: {
      //       drawerIcon: ({tintColor}) => (
      //         <Icon name="star-border" type="material" color={tintColor}/>
      //       )
      //     }},  
      }, 
      
      { initialRouteName: 'Descobrir',
        contentOptions: {
        activeTintColor: "#D32F2F",
        inactiveTintColor: 'white',  
        itemsContainerStyle: { 
          marginVertical: 0,
        },
        iconContainerStyle: { 
          opacity: 1
        },
        labelStyle: {
          fontWeight: 'normal',
        }             
      },
        contentComponent: SideBar
        
      }
      
 
 )
 const AppNavigator = createStackNavigator(
  {
  Drawer: { screen: Drawer },
  SerieDetail: {screen: SerieDetail},
  GenresList: {screen: GenresList},
  Profile: {screen : Profile}
  },
  
  {
  headerMode: "none",
  initialRouteName: "Drawer", 
  
  })
  const AppSwitchNavigator = createSwitchNavigator({
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStackNavigator,
    App: AppNavigator
    })

    const AppContainer = createAppContainer(AppSwitchNavigator);

export default AppContainer;