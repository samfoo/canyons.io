import React from "react";
import { IndexRoute, Route } from "react-router";
import App from "./components/application";
import Home from "./components/home";

var Root = React.createElement(
    Route,
    {path: "/", component: App},
    React.createElement(IndexRoute, {component: Home})
);

export default [Root];
