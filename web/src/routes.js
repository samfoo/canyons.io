import App from "./components/application";
import CanyonForm from "./components/canyons/new";
import CanyonShow from "./components/canyons/show";
import TripReportForm from "./components/canyons/trip-reports/new";
import Home from "./components/home";
import Login from "./components/login";
import SignUp from "./components/sign-up";
import NotFound from "./components/not-found";
import React from "react";
import { IndexRoute, Route } from "react-router";

export default function(store) {
    const r = (path, comp) => {
        let onEnter = comp.onEnter;

        let props = { path: path, component: comp };
        if (onEnter) {
            props.onEnter = onEnter(store);
        }

        return React.createElement(Route, props);
    };

    const home = () => {
        return React.createElement(IndexRoute, {
            component: Home,
            onEnter: Home.onEnter(store)
        });
    };

    var Root = React.createElement(
        Route,
        {path: "/", component: App, onEnter: App.onEnter(store)},

        home(),
        r("/login", Login),
        r("/sign-up", SignUp),
        r("/canyons/new", CanyonForm),
        r("/canyons/:id", CanyonShow),
        r("/canyons/:canyonId/trip-reports/new", TripReportForm),
        r("*", NotFound)
    );

    return [ Root ];
}
