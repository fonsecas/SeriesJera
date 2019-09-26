import { createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createDrawerNavigator, DrawerActions } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import LoginPage from './pages/login/LoginPage';
import WatchList from './pages/series/WatchList'
import SerieDetail from './pages/series/SerieDetail' 
import React, { Component } from 'react'; 
import { Ionicons } from '@expo/vector-icons'
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native'
import AuthLoadingScreen from './pages/login/AuthLoadingScreen'
import { Icon } from 'react-native-elements'
import MainScreen from './pages/home/MainScreen'
import RegisterPage from './pages/login/RegisterPage'
import SideBar from './components/Sidebar'

const AuthStackNavigator = createStackNavigator({
  LoginPage: { 
    screen: LoginPage,
    navigationOptions: {
      title: 'Bem Vindo',
      headerStyle: {
        backgroundColor: "#00796B",
        color: 'white'
      },
      headerTitleStyle: {
        color: 'white'
          }
    }
    },
    RegisterPage: { 
      screen: RegisterPage,
      navigationOptions: {
        title: 'Criar Conta',
        headerStyle: {
          backgroundColor: "#00796B",
          color: 'white'
        },
        headerTitleStyle: {
          color: 'white'
            },
        headerTintColor: 'white'
      }
      },

    
  },
  )
const Drawer = createDrawerNavigator(
  {
    Home: { screen: MainScreen, 
              navigationOptions: {
                drawerIcon: ({tintColor}) => (
                  <Icon name="home" style={{color: tintColor}}/>
                ),
              },
            },
    'Para Assistir': { screen: WatchList, 
      navigationOptions: {
        drawerIcon: ({tintColor}) => (
          <Icon name="playlist-play" style={{color: tintColor}}/>
        )
      }} 
      }, 
      {
        contentComponent: SideBar
      }
      
 
 )
 const AppNavigator = createStackNavigator(
  {
  Drawer: { screen: Drawer },
  SerieDetail: {screen: SerieDetail},
  
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