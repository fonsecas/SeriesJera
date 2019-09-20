import React from 'react';
import Router from './Router';

import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import rootReducer from './reducers'
import reduxThunk from 'redux-thunk'
import {composeWithDevTools} from 'remote-redux-devtools';

const store = createStore(rootReducer, composeWithDevTools());

const SeriesApp = prop => (
    <Provider store={store}>
        <Router/>
    </Provider>
);

export default SeriesApp;