import * as reducers from "./reducers";
import Immutable from "immutable";
import React from "react";
import cookieParser from "cookie-parser";
import express from "express";
import logger from "morgan";
import path from "path";
import routes from "./routes";
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { match, RoutingContext, Router } from "react-router";
import { renderToString } from "react-dom/server";
import { promises } from "./reducers/middleware";

export var app = express();

const layout = function(content, state) {
    return `<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="/site.css">
    </head>
    <body>
        <div id="render">${content}</div>
        <script type="application/javascript">
            window.__INITIAL_STATE__ = ${JSON.stringify(state)};
        </script>
        <script type="application/javascript" src="/app.js"></script>
    </body>
</html>`;
};

// TODO - make this environment dependent on how the app is started.
app.use(logger("dev"));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

app.use((req, res) => {
    const reducer = combineReducers(reducers);
    const store = applyMiddleware(promises)(createStore)(reducer);

    match({routes: routes(store), location: req.url}, (error, redir, props) => {
        if (error) {
            res.status(500).send(error);
        } else if (redir) {
            res.redirect(302, redir.pathname + redir.search);
        } else if (props) {
            let resourcesAllExist = props.components.reduce((all, comp) => {
                if (comp.exists) {
                    return all && comp.exists(props, store);
                } else {
                    return all;
                }
            }, true);

            if (!resourcesAllExist) {
                res.status(404);
            }

            const app = React.createElement(
                Provider,
                {store: store},
                React.createElement(RoutingContext, props)
            );

            const html = renderToString(app);
            res.end(
                layout(html, store.getState())
            );
        }
    });
});

app.use((err, req, res) => {
    res.status(err.status || 500);
    res.send(layout({
        content: err.message
    }));
});
