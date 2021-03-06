import * as UserActions from "../../actions/user";
import * as forms from "../forms";
import { User as Login } from "models";
import React from "react";
import { connect } from "react-redux";

var d = React.DOM;

@connect(state => state)
export class LoginForm extends forms.ValidatedForm {
    constructor(props, context) {
        super(props, context);
    }

    validate(model) {
        let results = Login.validate(model);
        delete results["name"];

        return results;
    }

    send(model) {
        let { dispatch } = this.props;

        return dispatch(
            UserActions.login(model.get("email"), model.get("password"))
        ).then(() => {
            // todo - redirect back to where they were going?
            this.props.history.pushState({}, "/");
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
            {id: "login", className: "page"},

            d.h2({}, "Login"),

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

                forms.submit("Login", this.submit.bind(this), this.state.submitting)
            )
        );
    }
}
