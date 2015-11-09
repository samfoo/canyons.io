import * as CanyonActions from "../../actions/canyon";
import * as canyon from "models/canyon";
import * as forms from "../forms";
import Immutable from "immutable";
import React from "react";
import gpxUploader from "./gpx-uploader";
import spinner from "../spinner";
import { connect } from "react-redux";

var d = React.DOM;

@connect(state => state)
export default class CanyonForm extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { canyon: new Immutable.Map() };
    }

    submit(e) {
        const { dispatch } = this.props;

        e.preventDefault();
        e.stopPropagation();

        let errors = Immutable.fromJS(canyon.validate(this.state.canyon.toJS()) || {});

        if (errors.isEmpty()) {
            this.setState({submitting: true});
            dispatch(CanyonActions.createCanyon(this.state.canyon.delete("errors"))).then(c => {
                this.props.history.pushState({}, `/canyons/${c.id}`);
            })
            .catch(e => {
                this.setState({
                    error: e,
                    submitting: false
                });
            });
        } else {
            let updated = errors.reduce((c, msgs, field) => {
                return c.setIn(["errors", field], msgs);
            }, this.state.canyon);

            this.setState({
                canyon: updated
            });
        }
    }

    set(field) {
        return (e) => {
            let updated = this.state.canyon.set(field, e.target.value);
            let errors = Immutable.fromJS(canyon.validate(updated.toJS()));

            let fieldErrors = errors.get(field, Immutable.Set(errors[field]));
            updated = updated.setIn(["errors", field], fieldErrors);

            this.setState({
                canyon: updated
            });
        }.bind(this);
    }

    errors(field) {
        return this.state.canyon.getIn(["errors", field], Immutable.Set());
    }

    render() {
        var e = this.state.error ? `${this.state.error.statusText}: ${this.state.error.data.message}` : null;

        return d.div(
            {id: "new-canyon-form"},
            d.form(
                {action: "/canyons", method: "POST", onSubmit: this.submit.bind(this)},

                forms.imageUploader(
                    "Add a cover photo",
                    { onChange: this.set("cover") }
                ),

                d.div(
                    {
                        className: "notification error",
                        style: {
                            display: e ? "block" : "none"
                        }
                    },
                    `There was an problem creating the canyon. ${e}`
                ),

                forms.text(
                    "Canyon Name",
                    "name",
                    {
                        className: "name-input",
                        errors: this.errors("name"),
                        placeholder: "e.g. Claustral",
                        onChange: this.set("name"),
                        disabled: this.state.submitting
                    }
                ),

                forms.textarea(
                    "Access",
                    "access",
                    {
                        className: "access-input",
                        errors: this.errors("access"),
                        placeholder: "How do you get to the canyon entrance?",
                        onChange: this.set("access"),
                        disabled: this.state.submitting
                    }
                ),

                forms.textarea(
                    "Track Notes",
                    "notes",
                    {
                        className: "notes-input",
                        errors: this.errors("notes"),
                        placeholder: "How do you get to the canyon, through it, and out?",
                        onChange: this.set("notes"),
                        disabled: this.state.submitting
                    }
                ),

                gpxUploader(),

                d.div(
                    {className: "submission"},

                    d.button({
                        className: "submit " + (this.state.submitting ? "disabled" : ""),
                        onClick: this.submit.bind(this),
                        disabled: this.state.submitting
                    }, "Create"),

                    spinner({
                        style: {
                            display: this.state.submitting ? "inline-block" : "none"
                        }
                    })
                )
            )
        )
    }
}
