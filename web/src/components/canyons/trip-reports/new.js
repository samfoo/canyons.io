import * as forms from "../../forms";
import React from "react";

var d = React.DOM;

export default class TripReportForm extends forms.ValidatedForm {
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
                    `There was an problem creating the trip report. ${e}`
                ),

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
                )
            )
        );
    }
}
