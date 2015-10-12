import React from 'react';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import layout from './layouts/default';
import logger from 'morgan';
import path from 'path';
import routes from './src/routes';
import {match, RoutingContext} from 'react-router';

export var app = express();

// TODO - make this environment dependent on how the app is started.
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    match({routes, location: req.url}, (error, redir, props) => {
        if (error) {
            res.send(500, error.message);
        } else if (redir) {
            res.redirect(302, redir.pathname + redir.search)
        } else if (props) {
            let innerHTML = React.renderToString(
                React.createElement(RoutingContext, props)
            );
            res.send(200, layout(innerHTML));
        }
    });
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.error(err);
    res.send(layout({
        content: err.message
    }));
});
