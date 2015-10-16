import * as reducers from './reducers';
import React from 'react';
import cookieParser from 'cookie-parser';
import express from 'express';
import logger from 'morgan';
import path from 'path';
import routes from './routes';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { match, RoutingContext } from 'react-router';
import { renderToString } from 'react-dom/server';

export var app = express();

const layout = function(content, state) {
    return `<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="site.css">
    </head>
    <body>
        <div id="render">${content}</div>
        <script type="application/javascript">
            window.__INITIAL_STATE__ = ${JSON.stringify(state)};
        </script>
        <script type="application/javascript" src="app.js"></script>
    </body>
</html>`
};

// TODO - make this environment dependent on how the app is started.
app.use(logger('dev'));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use((req, res, next) => {
    const reducer = combineReducers(reducers);
    const store = createStore(reducer);

    match({routes, location: req.url}, (error, redir, props) => {
        if (error) {
            res.status(500).send(error.message);
        } else if (redir) {
            res.redirect(302, redir.pathname + redir.search)
        } else if (props) {
            const app = React.createElement(
                Provider,
                {store: store},
                React.createElement(RoutingContext, props)
            );

            let innerHTML = renderToString(app);

            res.status(200)
                .send(layout(innerHTML, store.getState()));
        } else {
            res.status(404).send("not found")
        }
    });
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    console.error(err);
    res.send(layout({
        content: err.message
    }));
});
