import React from "react";
import { Application } from "./components/application";
import { Contact } from "./components/contact";
import { Home } from "./components/home";
import { IndexRoute, Route } from "react-router";
import { LoginForm } from "./components/login";
import { NewCanyon } from "./components/canyons/new";
import { NotFound } from "./components/not-found";
import { ShowCanyon } from "./components/canyons/show";
import { SignUp } from "./components/sign-up";
import { TripReportForm } from "./components/canyons/trip-reports/new";

export function routes(store) {
    const r = (path, component) => {
        let { onEnter } = component;

        let props = { path, component };
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
        {path: "/", component: Application, onEnter: Application.onEnter(store)},

        home(),
        r("/contact-us", Contact),
        r("/login", LoginForm),
        r("/sign-up", SignUp),
        r("/canyons/new", NewCanyon),
        r("/canyons/:id", ShowCanyon),
        r("/canyons/:canyonId/trip-reports/new", TripReportForm),
        r("*", NotFound)
    );

    return [ Root ];
}
