import { createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createDrawerNavigator, DrawerActions } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import LoginPage from './pages/LoginPage';
import FavoriteSeries from './pages/FavoriteSeries'
import SerieDetail from './pages/SerieDetail'
import React, { Component } from 'react'; 
import { Ionicons } from '@expo/vector-icons'
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native'
import AuthLoadingScreen from './pages/AuthLoadingScreen'
import { Icon } from 'react-native-elements'
import MainScreen from './pages/MainScreen'

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
    }
    
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
    Favoritos: { screen: FavoriteSeries, 
      navigationOptions: {
        drawerIcon: ({tintColor}) => (
          <Icon name="list" style={{color: tintColor}}/>
        )
      }}
      },
      
 
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