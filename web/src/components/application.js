import * as UserActions from "../actions/user";
import React from "react";
import { Beard } from "./beard";
import { Header } from "./header";
import { connect } from "react-redux";
import { fetch } from "../decorators";

var d = React.DOM;

@fetch((store) => {
    if (!store.loaded("users.current")) {
        return store.dispatch(UserActions.getCurrentUser());
    }
})
@connect(state => ({users: state.users}))
export class Application extends React.Component {
    render() {
        return d.div(
            { className: "wrapper" },
            React.createElement(Header, this.props),
            this.props.children,
            React.createElement(Beard, this.props)
        );
    }
}
