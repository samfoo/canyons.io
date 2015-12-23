import * as reducers from "./reducers";
import Immutable from "immutable";
import React from "react";
import ReactDOM from "react-dom";
import createBrowserHistory from "history/lib/createBrowserHistory";
import { Unauthorized } from "./components/unauthorized";
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
} else if (store.getState().error == 403) {
    ReactDOM.render(
        React.createElement(Unauthorized, {}),
        document.getElementById("render")
    );
} else {
    let onError = (e) => {
        if (e.status == 403) {
            ReactDOM.render(
                React.createElement(Unauthorized, {}),
                document.getElementById("render")
            );
            return;
        } else {
            throw e;
        }
    };

    let children = routes(store);

    ReactDOM.render(
        React.createElement(
            Provider,
            {store: store},
            React.createElement(
                Router,
                {children, history, onError}
            )
        ),
        document.getElementById("render")
    );
}
