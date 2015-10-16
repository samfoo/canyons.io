import React from 'react';
import { connect } from 'react-redux';

var d = React.DOM;

@connect(state => ({users: state.users}))
export default class Home extends React.Component {
    render() {
        const { users } = this.props;

        let header;
        if (users.current) {
            header = d.header({id: "site-header"}, users.current.name);
        } else {
            header = d.header({id: "site-header"}, "login");
        }

        return d.div(
            {id: "hero"},
            header,
            d.div({id: "hero-background"}),
            d.div(
                {id: "hero-foreground"},
                d.h1({}, "canyons.io"),
                d.h2({}, "The collaborative canyoning database")
            )
        );
    }
}
