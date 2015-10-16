import React from 'react';
import { IndexRoute, Route } from 'react-router';
import App from './components/application';
import Home from './components/home';

var Index = React.createElement(
    IndexRoute,
    {component: Home}
);

var Root = React.createElement(
    Route,
    {path: "/", component: App},
    Index
);

export default [Root];
