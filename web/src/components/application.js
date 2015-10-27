import * as UserActions from "../actions/user";
import React from "react";
import { Link } from "react-router";
import { connect } from "react-redux";
import { fetch } from "../decorators";

var d = React.DOM;

@fetch((store) => {
    if (!store.loaded("users.current")) {
        return store.dispatch(UserActions.getCurrentUser());
    }
})
@connect(state => ({users: state.users}))
export default class Application extends React.Component {
    render() {
        const { users } = this.props;

        let header;
        if (users.has("current")) {
            header = d.header(
                {id: "site-header"},
                d.span(
                    {id: "logo"},
                    React.createElement(Link, {to: "/"}, "canyons.io")
                ),
                "Hello, ",
                users.getIn(["current", "name"])
            );
        } else {
            header = d.header(
                {id: "site-header"},
                d.span(
                    {id: "logo"},
                    React.createElement(Link, {to: "/"}, "canyons.io")
                ),
                React.createElement(Link, {to: "/login"}, "login")
            );
        }

        return d.div(
            {className: "wrapper"},
            header,
            this.props.children
        );
    }
}
