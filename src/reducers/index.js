import {combineReducers } from 'redux'
import userReducer from './userReducer'
import seriesReducer from './seriesReducer';


export default combineReducers({
    user: userReducer,
    series: seriesReducer,
}) 