import React from "react";
import { Link } from "react-router";

var d = React.DOM;

export default class Header extends React.Component {
    render() {
        const { users } = this.props;

        if (users.hasIn(["current", "email"])) {
            return d.header(
                {id: "site-header"},
                d.div(
                    {},
                    d.span(
                        {id: "logo"},
                        React.createElement(Link, {to: "/"}, "canyons.io")
                    ),
                    d.span(
                        {id: "account-actions"},
                        "Hello, ",
                        users.getIn(["current", "email"])
                    )
                )
            );
        } else {
            return d.header(
                {id: "site-header"},
                d.div(
                    {},
                    d.span(
                        {id: "logo"},
                        React.createElement(Link, {to: "/"}, "canyons.io")
                    ),
                    d.span(
                        {id: "account-actions"},
                        React.createElement(Link, {to: "/sign-up"}, "sign up"),
                        React.createElement(Link, {to: "/login"}, "login")
                    )
                )
            );
        }
    }
}
