import * as CanyonActions from "../../actions/canyon";
import * as forms from "../forms";
import * as links from "../../utils/links";
import Immutable from "immutable";
import React from "react";
import { Canyon } from "models";
import { GpsUploader } from "./gps-uploader";
import { authorized } from "../../decorators";
import { connect } from "react-redux";

var d = React.DOM;

function gpsUploader(props) {
    return React.createElement(GpsUploader, props);
}

@authorized(user => !user.isEmpty())
@connect(state => state)
export class NewCanyon extends forms.ValidatedForm {
    constructor(props, context) {
        super(props, context);
    }

    validate(model) {
        return Canyon.validate(model);
    }

    send(model) {
        let { dispatch } = this.props;

        return dispatch(CanyonActions.createCanyon(model.delete("errors"))).then(c => {
            this.props.history.pushState({}, links.canyons.show(Immutable.fromJS(c)));
        });
    }

    setBadge(field) {
        let setter = (e) => {
            let model = this.state.model;

            if (!this.state.model.get("badges")) {
                model = this.state.model.set("badges", Immutable.Set());
            }

            let badges = model.get("badges"),
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
            {id: "new-canyon"},
            d.form(
                {action: "/canyons", method: "POST", onSubmit: this.submit.bind(this)},

                forms.imageUploader(
                    "Add a cover photo",
                    { onChange: this.set("cover") }
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

                forms.text(
                    "Name",
                    "name",
                    {
                        className: "name-input",
                        errors: this.errors("name"),
                        placeholder: "e.g. Claustral",
                        onChange: this.set("name"),
                        disabled: this.state.submitting
                    }
                ),

                d.div(
                    {className: "badges field"},

                    d.label({}, "Badges"),

                    forms.badge("Abseiling", "abseil", { onChange: this.setBadge("abseil") } ),
                    forms.badge("Summer Only", "cold", { onChange: this.setBadge("cold") } ),
                    forms.badge("Swimming", "swim", { onChange: this.setBadge("swim") } ),
                    forms.badge("Wetsuit Required", "wetsuit", { onChange: this.setBadge("wetsuit") } )
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

                forms.submit("Create Canyon", this.submit.bind(this), this.state.submitting)
            )
        );
    }
}
