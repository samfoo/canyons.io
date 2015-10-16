import React from 'react';

var d = React.DOM;

export default class Home extends React.Component {
    render() {
        return d.div(
            {id: "hero"},
            d.div({id: "hero-background"}),
            d.div(
                {id: "hero-foreground"},
                d.h1({}, "canyons.io"),
                d.h2({}, "The collaborative canyoning database")
            )
        );
    }
}
