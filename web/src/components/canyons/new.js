import * as CanyonActions from "../../actions/canyon";
import * as Canyon from "models/canyon";
import * as forms from "../forms";
import React from "react";
import gpsUploader from "./gps-uploader";
import spinner from "../spinner";
import { connect } from "react-redux";

var d = React.DOM;

@connect(state => state)
export default class CanyonForm extends forms.ValidatedForm {
    constructor(props, context) {
        super(props, context);
    }

    validate(model) {
        return Canyon.validate(model);
    }

    send(model) {
        let { dispatch } = this.props;

        return dispatch(CanyonActions.createCanyon(model.delete("errors"))).then(c => {
            this.props.history.pushState({}, `/canyons/${c.id}`);
        });
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

                gpsUploader({
                    className: "gps-input",
                    errors: this.errors("gps"),
                    onChange: this.set("gps"),
                    disabled: this.state.submitting
                }),

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
        );
    }
}
