import * as CanyonActions from "../../../actions/canyon";
import * as TripReport from "models/trip-report";
import * as forms from "../../forms";
import React from "react";
import { connect } from "react-redux";

var d = React.DOM;

@connect(state => state)
export default class TripReportForm extends forms.ValidatedForm {
    constructor(props, context) {
        super(props, context);
    }

    validate(model) {
        return TripReport.validate(model);
    }

    send(model) {
        let { dispatch } = this.props;
        let { canyonId } = this.props.params;

        return dispatch(CanyonActions.createTripReport(canyonId, model.delete("errors"))).then(c => {
            this.props.history.pushState({}, `/canyons/${canyonId}`);
        });
    }

    render() {
        let e = this.state.error ? `${this.state.error.statusText}: ${this.state.error.data.message}` : null;

        return d.div(
            {id: "new-trip-report"},

            d.form(
                {action: `/canyons/todo-add-id/trip-reports`, method: "POST", onSubmit: this.submit.bind(this)},

                d.div(
                    {
                        className: "notification error",
                        style: {
                            display: e ? "block" : "none"
                        }
                    },
                    "There was a problem creating the trip report."
                ),

                forms.date(
                    "Date of Trip",
                    "date",
                    {
                        className: "date-input",
                        errors: this.errors("date"),
                        onChange: this.set("date"),
                        disabled: this.state.submitting
                    }
                ),

                forms.rating("Rating", {
                    className: "rating-input",
                    errors: this.errors("rating"),
                    onChange: this.set("rating"),
                    disabled: this.state.submitting
                }),

                forms.textarea(
                    "Comments",
                    "comments",
                    {
                        maxLength: 300,
                        className: "comments-input",
                        errors: this.errors("comments"),
                        placeholder: "The main abseil was clogged with flotsom...",
                        onChange: this.set("comments"),
                        disabled: this.state.submitting
                    }
                ),

                forms.submit("Create Trip Report", this.submit.bind(this), this.state.submitting)
            )
        );
    }
}