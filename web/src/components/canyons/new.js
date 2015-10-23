import * as CanyonActions from "../../actions/canyon";
import * as canyon from "models/canyon";
import * as forms from "../forms";
import Immutable from "immutable";
import React from "react";

var d = React.DOM;

export default class NewCanyonForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { canyon: new Immutable.Map() };
    }

    submit(e) {
        e.preventDefault();
        e.stopPropagation();
        CanyonActions.createCanyon(this.state.canyon);
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
        return d.div(
            {id: "new-canyon-form"},
            d.form(
                {action: "/canyons", method: "POST", onSubmit: this.submit.bind(this)},

                forms.text(
                    "Canyon Name",
                    "name",
                    {
                        errors: this.errors("name"),
                        placeholder: "e.g. Claustral",
                        onChange: this.set("name")
                    }
                ),

                forms.textarea(
                    "Access",
                    "access",
                    {
                        errors: this.errors("access"),
                        placeholder: "How do you get to the canyon entrance?",
                        onChange: this.set("access")
                    }
                ),

                forms.textarea(
                    "Track Notes",
                    "notes",
                    {
                        errors: this.errors("notes"),
                        placeholder: "How do you get to the canyon, through it, and out?",
                        onChange: this.set("notes")
                    }
                ),

                d.button({className: "submit", onClick: this.submit.bind(this)}, "Create")
            )
        )
    }
}
