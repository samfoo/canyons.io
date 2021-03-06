import * as UserActions from "../../actions/user";
import * as forms from "../forms";
import { User } from "models";
import React from "react";
import { connect } from "react-redux";

var d = React.DOM;

@connect(state => state)
export class SignUp extends forms.ValidatedForm {
    constructor(props, context) {
        super(props, context);
    }

    validate(model) {
        return User.validate(model);
    }

    send(model) {
        let { dispatch } = this.props;

        return dispatch(
            UserActions.register(
                model.get("email"),
                model.get("name"),
                model.get("password")
            )
        )
        .then(() => {
            this.props.history.pushState({}, `/`);
        });
    }

    render() {
        return d.div(
            {id: "sign-up", className: "page"},

            d.h2({}, "Create Account"),

            d.form(
                {action: "/sign-up", method: "POST"},

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

                forms.text(
                    "Display Name",
                    "name",
                    {
                        errors: this.errors("name"),
                        placeholder: "Sam Gibson",
                        onChange: this.set("name"),
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

                forms.submit("Create Account", this.submit.bind(this), this.state.submitting)
            )
        );
    }
}
