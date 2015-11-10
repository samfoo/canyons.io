import * as UserActions from "../../actions/user";
import * as forms from "../forms";
import * as Login from "models/user";
import Immutable from "immutable";
import React from "react";
import spinner from "../spinner";
import { connect } from "react-redux";

var d = React.DOM;

@connect(state => state)
export default class LoginForm extends forms.ValidatedForm {
    constructor(props, context) {
        super(props, context);
    }

    validate(model) {
        return Login.validate(model);
    }

    send(model) {
        let { dispatch } = this.props;

        return dispatch(
            UserActions.login(this.state.model.get("email"), this.state.model.get("password"))
        ).then(() => {
            // todo - redirect back to where they were going?
            this.props.history.pushState({}, `/`);
        })
        .catch(e => {
            this.setState({ submitting: false });

            if (e.status == 401) {
                this.setState({
                    error: "Incorrect email or password"
                });
            } else {
                this.settsate({
                    error: `The was an unexpected problem: ${e.data}`
                });
            }
        });
    }

    render() {
        return d.div(
            {id: "login"},

            d.form(
                {action: "/sessions", method: "POST"},

                d.div(
                    {
                        className: "notification error plain",
                        style: {
                            display: this.state.error ? "block" : "none"
                        }
                    },
                    this.state.error
                ),

                forms.text(
                    "Email",
                    "email",
                    {
                        errors: this.errors("email"),
                        placeholder: "email@example.com",
                        onChange: this.set("email"),
                        disabled: this.state.submitting
                    }
                ),

                forms.password(
                    "Password",
                    "password",
                    {
                        errors: this.errors("password"),
                        placeholder: "super secret",
                        onChange: this.set("password"),
                        type: "password",
                        disabled: this.state.submitting
                    }
                ),

                d.div(
                    {className: "submission"},

                    d.button({
                        className: "submit " + (this.state.submitting ? "disabled" : ""),
                        onClick: this.submit.bind(this),
                        disabled: this.state.submitting
                    }, "Login"),

                    spinner({
                        style: {
                            display: this.state.submitting ? "inline-block" : "none"
                        }
                    })
                )
            )
        );
    }
}
