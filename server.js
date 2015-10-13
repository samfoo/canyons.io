import React from 'react';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import layout from './layouts/default';
import logger from 'morgan';
import path from 'path';
import routes from './src/routes';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { match, RoutingContext } from 'react-router';
import { renderToString } from 'react-dom/server';

export var app = express();

// TODO - make this environment dependent on how the app is started.
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    const store = createStore((state, action) => state);

    match({routes, location: req.url}, (error, redir, props) => {
        if (error) {
            res.send(500, error.message);
        } else if (redir) {
            res.redirect(302, redir.pathname + redir.search)
        } else if (props) {
            const app = React.createElement(
                Provider,
                {store: store},
                React.createElement(RoutingContext, props)
            );

            let innerHTML = renderToString(app);

            res.send(200, layout(innerHTML));
        } else {
            // todo - handle 404
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
