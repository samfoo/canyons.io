import * as forms from "../forms";
import Immutable from "immutable";
import React from "react";
import { GpsUploader } from "./gps-uploader";
import { Canyon } from "models";

var d = React.DOM;

function gpsUploader(props) {
    return React.createElement(GpsUploader, props);
}

export class CanyonForm extends forms.ValidatedForm {
    constructor(props, context) {
        super(props, context);
        this.state = {
            model: props.model
        };
    }

    validate(model) {
        return Canyon.validate(model);
    }

    send(model) {
        return this.props.send(model);
    }

    setBadge(field) {
        let setter = (e) => {
            let model = this.state.model;

            if (!this.state.model.get("badges")) {
                model = this.state.model.set("badges", Immutable.Set());
            }

            let badges = model.get("badges", Immutable.Set()).toSet(),
                updated;

            if (e.target.value) {
                updated = badges.add(field);
            } else {
                updated = badges.delete(field);
            }

            this.setState({
                model: model.set("badges", updated)
            });
        };

        return setter.bind(this);
    }

    render() {
        var e = this.state.error ? `${this.state.error.statusText}` : null;

        return d.div(
            {id: "canyon-form"},

            d.form(
                {action: "/canyons", method: "POST", onSubmit: this.submit.bind(this)},

                forms.imageUploader(
                    "Change cover photo",
                    {
                        value: this.state.model.get("cover"),
                        onChange: this.set("cover")
                    }
                ),

                d.div(
                    {
                        className: "notification error plain",
                        style: {
                            display: e ? "block" : "none"
                        }
                    },
                    "There was a problem creating the canyon."
                ),

                d.div(
                    {className: "page"},

                    this.props.editting ?
                        d.h1({}, this.state.model.get("name")) :
                        forms.text(
                            "Name",
                            "name",
                            {
                                className: "name-input",
                                value: this.state.model.get("name"),
                                errors: this.errors("name"),
                                placeholder: "e.g. Claustral",
                                onChange: this.set("name"),
                                disabled: this.state.submitting
                            }
                        ),

                    d.div(
                        {className: "badges field"},

                        d.label({}, "Badges"),

                        forms.badge("Abseiling", "abseil", {
                            value: this.state.model.get("badges", Immutable.Set()).includes("abseil"),
                            onChange: this.setBadge("abseil")
                        }),
                        forms.badge("Summer Only", "cold", {
                            value: this.state.model.get("badges", Immutable.Set()).includes("cold"),
                            onChange: this.setBadge("cold")
                        }),
                        forms.badge("Swimming", "swim", {
                            value: this.state.model.get("badges", Immutable.Set()).includes("swim"),
                            onChange: this.setBadge("swim")
                        }),
                        forms.badge("Wetsuit Required", "wetsuit", {
                            value: this.state.model.get("badges", Immutable.Set()).includes("wetsuit"),
                            onChange: this.setBadge("wetsuit")
                        })
                    ),

                    forms.textarea(
                        "Access",
                        "access",
                        {
                            className: "access-input",
                            value: this.state.model.get("access"),
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
                            value: this.state.model.get("notes"),
                            placeholder: "How do you get to the canyon, through it, and out?",
                            onChange: this.set("notes"),
                            disabled: this.state.submitting
                        }
                    )
                ),

                gpsUploader({
                    className: "gps-input",
                    value: this.state.model.get("gps"),
                    errors: this.errors("gps"),
                    onChange: this.set("gps"),
                    disabled: this.state.submitting
                }),

                this.props.editting ?
                    forms.submit("Save Changes", this.submit.bind(this), this.submitting) :
                    forms.submit("Create Canyon", this.submit.bind(this), this.state.submitting)
            )
        );
    }
}
