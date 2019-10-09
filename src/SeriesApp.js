import React from 'react'
import Router from './Router'
import firebase from 'firebase'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import reduxThunk from 'redux-thunk'
import rootReducer from './reducers'
import { composeWithDevTools } from 'remote-redux-devtools'
import ConfigBase from './util/ConfigBase'

 
firebase.initializeApp(ConfigBase.CONFIG);
  
const store = createStore(rootReducer, composeWithDevTools(
  applyMiddleware(reduxThunk)
))

const SeriesApp = prop => (
  <Provider store={store}>
      <Router/>
  </Provider>
  
)

export default SeriesApp