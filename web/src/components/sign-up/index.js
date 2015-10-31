import * as UserActions from "../../actions/user";
import * as forms from "../forms";
import * as user from "models/user";
import Immutable from "immutable";
import React from "react";
import spinner from "../spinner";
import { connect } from "react-redux";

var d = React.DOM;

@connect(state => state)
export default class SignUp extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { register: new Immutable.Map() };
    }

    submit(e) {
        const { dispatch } = this.props;

        e.preventDefault();
        e.stopPropagation();

        let errors = Immutable.fromJS(
            user.validate(this.state.register.toJS())
        );

        if (this.state.register.get("password") !== this.state.register.get("confirmation")) {
            errors = errors.set("confirmation", Immutable.List(["must match password"]));
        }

        if (errors.isEmpty()) {
            this.setState({submitting: true});
            dispatch(
                UserActions.register(
                    this.state.register.get("email"),
                    this.state.register.get("password"),
                    this.state.register.get("confirmation")
                )
            )
            .then(c => {
                this.props.history.pushState({}, `/`);
            })
            .catch(e => {
                this.setState({
                    submitting: false,
                    error: `The was an unexpected problem: ${e.data}`
                });
            });
        } else {
            let updated = errors.reduce((c, msgs, field) => {
                return c.setIn(["errors", field], msgs);
            }, this.state.register);

            this.setState({
                register: updated
            });
        }
    }

    set(field) {
        return (e) => {
            let updated = this.state.register.set(field, e.target.value);
            let errors = Immutable.fromJS(user.validate(updated.toJS()));

            if (updated.get("password") !== updated.get("confirmation")) {
                errors = errors.set("confirmation", Immutable.List(["must match password"]));
            }

            let fieldErrors = errors.get(field, Immutable.Set(errors[field]));
            updated = updated.setIn(["errors", field], fieldErrors);

            this.setState({
                register: updated
            });
        }.bind(this);
    }

    errors(field) {
        return this.state.register.getIn(["errors", field], Immutable.Set());
    }

    render() {
        return d.div(
            {id: "sign-up"},

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

                forms.password(
                    "Confirm Password",
                    "confirmation",
                    {
                        errors: this.errors("confirmation"),
                        placeholder: "super secret",
                        onChange: this.set("confirmation"),
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
                    }, "Register"),

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
