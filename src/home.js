import React from 'react';

var d = React.DOM;

export default class Home extends React.Component {
    render() {
        return d.div(
            {className: "home"},
            "Hello from the Home component"
        );
    }
}
