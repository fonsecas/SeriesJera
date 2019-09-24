import React from 'react'
import Router from './Router'
import firebase from 'firebase'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import reduxThunk from 'redux-thunk'
import rootReducer from './reducers'
import { composeWithDevTools } from 'remote-redux-devtools'


  var config = {
          apiKey: "AIzaSyANrg7BYCCXpkT9zo6Mb3CG_BuBc1AfdkU",
          authDomain: "seriesjera2019.firebaseapp.com",
          databaseURL: "https://seriesjera2019.firebaseio.com",
          projectId: "seriesjera2019",
          storageBucket: "",
          messagingSenderId: "750035580453",
          appId: "1:750035580453:web:19ab5f51ba30efef92b1cc"
        };
        // Inicializa Firebase
        firebase.initializeApp(config);
  
const store = createStore(rootReducer, composeWithDevTools(
  applyMiddleware(reduxThunk)
))

const SeriesApp = prop => (
  <Provider store={store}>
      <Router/>
  </Provider>
  
)

export default SeriesApp