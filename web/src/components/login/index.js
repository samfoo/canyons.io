import * as UserActions from "../../actions/user";
import * as forms from "../forms";
import * as login from "models/user";
import Immutable from "immutable";
import React from "react";
import spinner from "../spinner";
import { connect } from "react-redux";

var d = React.DOM;

@connect(state => state)
export default class Login extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { login: new Immutable.Map() };
    }

    submit(e) {
        const { dispatch } = this.props;

        e.preventDefault();
        e.stopPropagation();

        let errors = Immutable.fromJS(login.validate(this.state.login.toJS()));

        if (errors.isEmpty()) {
            this.setState({submitting: true});
            dispatch(UserActions.login(this.state.login.get("email"), this.state.login.get("password")))
            .then(c => {
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
        } else {
            let updated = errors.reduce((c, msgs, field) => {
                return c.setIn(["errors", field], msgs);
            }, this.state.login);

            this.setState({
                login: updated
            });
        }
    }

    set(field) {
        return (e) => {
            let updated = this.state.login.set(field, e.target.value);
            let errors = Immutable.fromJS(login.validate(updated.toJS()));

            let fieldErrors = errors.get(field, Immutable.Set(errors[field]));
            updated = updated.setIn(["errors", field], fieldErrors);

            this.setState({
                login: updated
            });
        }.bind(this);
    }

    errors(field) {
        return this.state.login.getIn(["errors", field], Immutable.Set());
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
