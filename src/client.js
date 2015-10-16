import * as reducers from './reducers';
import Immutable from 'immutable';
import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import routes from './routes';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { createStore, combineReducers } from 'redux';

const history = createBrowserHistory();
const initialState = window.__INITIAL_STATE__;

Object
    .keys(initialState)
    .forEach((key) => {
        initialState[key] = Immutable.fromJS(initialState[key]);
    });

const reducer = combineReducers(reducers);
const store = createStore(reducer);

ReactDOM.render(
    React.createElement(
        Provider,
        // todo - wire up a hydrated store here
        {store: store},
        React.createElement(
            Router,
            {children: routes, history: history}
        )
    ),
    document.getElementById("render")
);
