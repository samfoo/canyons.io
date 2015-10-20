import * as UserActions from "../actions/user";
import React from "react";
import { connect } from "react-redux";

var d = React.DOM;

@connect(state => ({users: state.users}))
export default class Application extends React.Component {
    static deps = [
        UserActions.getCurrentUser
    ];

    render() {
        const { users } = this.props;

        let header;
        if (users.has("current")) {
            header = d.header(
                {id: "site-header"},
                "Hello, ",
                users.getIn(["current", "name"])
            );
        } else {
            header = d.header(
                {id: "site-header"},
                d.a({}, "login")
            );
        }

        return d.div(
            {className: "wrapper"},
            header,
            this.props.children
        );
    }
}
