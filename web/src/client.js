import * as reducers from "./reducers";
import Immutable from "immutable";
import React from "react";
import ReactDOM from "react-dom";
import createBrowserHistory from "history/lib/createBrowserHistory";
import { NotFound } from "./components/not-found";
import { Provider } from "react-redux";
import { Router } from "react-router";
import { addLoaded } from "./utils/enhancers";
import { api } from "./actions/api";
import { compose, createStore, combineReducers, applyMiddleware } from "redux";
import { promises } from "./reducers/middleware";
import { routes } from "./routes";

const history = createBrowserHistory();
const initialState = window.__INITIAL_STATE__;

Object
    .keys(initialState)
    .forEach((key) => {
        initialState[key] = Immutable.fromJS(initialState[key]);
    });

const reducer = combineReducers(reducers);
const store = compose(
    addLoaded,
    applyMiddleware(promises(api()))
)(createStore)(reducer, initialState);

if (store.getState().error == 404) {
    ReactDOM.render(
        React.createElement(NotFound, {}),
        document.getElementById("render")
    );
} else {
    ReactDOM.render(
        React.createElement(
            Provider,
            {store: store},
            React.createElement(
                Router,
                {children: routes(store), history: history}
            )
        ),
        document.getElementById("render")
    );
}
