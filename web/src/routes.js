import App from "./components/application";
import CanyonForm from "./components/canyons/new";
import CanyonShow from "./components/canyons/show";
import Home from "./components/home";
import NotFound from "./components/not-found";
import React from "react";
import { IndexRoute, Route } from "react-router";

const r = (path, comp) => {
    return React.createElement(Route, {path: path, component: comp});
};

const home = () => React.createElement(IndexRoute, {component: Home});

var Root = React.createElement(
    Route,
    {path: "/", component: App},

    // Application routes
    home(),
    r("/canyons/new", CanyonForm),
    r("/canyons/:id", CanyonShow),
    r("*", NotFound)
);

export default [ Root ];
