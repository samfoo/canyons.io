import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import routes from './routes';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

let history = createBrowserHistory();

ReactDOM.render(
    React.createElement(
        Provider,
        // todo - wire up a hydrated store here
        {},
        React.createElement(
            Router,
            {children: routes, history: history}
        )
    ),
    document.getElementById("render")
);
