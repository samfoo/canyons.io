import * as UserActions from "../actions/user";
import React from "react";
import Header from "./header";
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

        return d.div(
            {
                className: "wrapper",
                style: {
                    marginTop: this.props.location.pathname == "/" ? null : "50px"
                }
            },
            React.createElement(Header, this.props),
            this.props.children
        );
    }
}
