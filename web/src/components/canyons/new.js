import * as CanyonActions from "../../actions/canyon";
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
            this.setState({
                canyon: this.state.canyon.set(field, e.target.value)
            });
        }.bind(this);
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
                        placeholder: "e.g. Claustral",
                        onChange: this.set("name")
                    }
                ),

                forms.textarea(
                    "Access",
                    "access",
                    {
                        placeholder: "How do you get to the canyon entrance?",
                        onChange: this.set("access")
                    }
                ),

                forms.textarea(
                    "Track Notes",
                    "notes",
                    {
                        placeholder: "How do you get to the canyon, through it, and out?",
                        onChange: this.set("notes")
                    }
                ),

                d.button({onClick: this.submit.bind(this)}, "Create")
            )
        )
    }
}
