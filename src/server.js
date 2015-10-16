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
import { match, RoutingContext } from "react-router";
import { renderToString } from "react-dom/server";
import { promises } from "./reducers/middleware";

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
</html>`;
};

// TODO - make this environment dependent on how the app is started.
app.use(logger("dev"));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

app.use((req, res) => {
    const reducer = combineReducers(reducers);
    const store = applyMiddleware(promises)(createStore)(reducer);

    match({routes, location: req.url}, (error, redir, props) => {
        if (error) {
            res.status(500).send(error.message);
        } else if (redir) {
            res.redirect(302, redir.pathname + redir.search);
        } else if (props) {
            let allDeps = props.components.reduce((deps, comp) => {
                let compDeps = comp.deps || [];

                if (comp.WrappedComponent) {
                    compDeps.concat(comp.WrappedComponent.deps || []);
                }

                return deps.union(compDeps);
            }, new Immutable.Set());

            let loadDepState = Promise.all(allDeps.map((d) => store.dispatch(d())));

            loadDepState
                .then(() => {
                    const app = React.createElement(
                        Provider,
                        {store: store},
                        React.createElement(RoutingContext, props)
                    );

                    return renderToString(app);
                })
                .then((html) => {
                    res.end(
                        layout(html, store.getState())
                    );
                })
                .catch((err) => res.status(500).end(err.message));

        } else {
            res.status(404).send("not found");
        }
    });
});

app.use((err, req, res) => {
    res.status(err.status || 500);
    res.send(layout({
        content: err.message
    }));
});
