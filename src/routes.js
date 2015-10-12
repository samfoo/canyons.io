import React from 'react';
import { IndexRoute, Route } from 'react-router';
import App from './application';
import Home from './home';

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
