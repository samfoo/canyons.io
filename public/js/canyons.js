var React = require("react"),
    d = React.DOM,
    forms = require("./forms");

var Form = React.createClass({
    render: function() {
        return d.form(
            {action: "/canyons", method: "POST"},

            forms.text("Canyon Name", "name", {
                placeholder: "e.g. Starlight",
                id: "name"
            }),

            forms.textarea("Driving Directions", "directions", {
                placeholder: "How do you get to the carpark?",
                id: "directions"
            }),

            forms.textarea("Track Notes", "notes", {
                placeholder: "How do you get to the canyon, how do you get through it, and how to get out?",
                id: "notes"
            }),

            forms.button("Create Canyon", {className: "submit"})
        );
    }
});

module.exports = {
    Form: Form,

    views: {
        form: function() {
            React.render(
                React.createElement(Form, {}),
                document.getElementById("new-canyon")
            );
        }
    }
};
