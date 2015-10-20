import React from "react";
import { IndexRoute, Route } from "react-router";
import App from "./components/application";
import Home from "./components/home";
import NewCanyonForm from "./components/canyons/new";

var Root = React.createElement(
    Route,
    {path: "/", component: App},
    React.createElement(IndexRoute, {component: Home})
);

var CanyonsNew = React.createElement(
    Route,
    {path: "/canyons/new", component: App},
    React.createElement(IndexRoute, {component: NewCanyonForm})
);

export default [
    Root,
    CanyonsNew
];
