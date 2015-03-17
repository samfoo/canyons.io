var React = require("react"),
    d = React.DOM,
    forms = require("./forms"),
    r = require("ramda"),
    canyon = require("../models/canyon");

var Form = React.createClass({
    getInitialState: function() {
        return {
            model: {
                errors: {}
            }
        };
    },

    set: function(field) {
        return r.bind(function(e) {
            var v = e.target.value,
                update = {};

            update[field] = v;

            var model = r.merge(this.state.model, update);
            model.errors[field] = canyon.validate(model)[field];

            this.setState({
                model: model
            });
        }, this);
    },

    render: function() {
        return d.div(
            {id: "new-canyon"},
            d.form(
                {action: "/canyons", method: "POST"},

                forms.imageUploader("Add a cover photo"),

                forms.text("Canyon Name", "name", {
                    placeholder: "e.g. Starlight",
                    id: "name",
                    model: this.state.model,
                    onChange: this.set("name"),
                    onBlur: this.set("name")
                }),

                forms.textarea("Driving Directions", "directions", {
                    placeholder: "How do you get to the carpark?",
                    id: "directions",
                    model: this.state.model,
                    onChange: this.set("directions"),
                    onBlur: this.set("directions")
                }),

                forms.textarea("Track Notes", "notes", {
                    placeholder: "How do you get to the canyon, how do you get through it, and how to get out?",
                    id: "notes",
                    model: this.state.model,
                    onChange: this.set("notes"),
                    onBlur: this.set("notes")
                }),

                forms.button("Create Canyon", {className: "submit"})
            )
        );
    }
});

module.exports = {
    Form: Form,

    views: {
        form: function() {
            React.render(
                React.createElement(Form, {}),
                document.getElementById("content")
            );
        }
    }
};
