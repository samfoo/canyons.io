import React from "react";

var d = React.DOM;

export class Contact extends React.Component {
    render() {
        return d.div(
            {className: "page", id: "contact"},

            d.h2({}, "Contact Us"),

            d.p(
                {},
                "We love questions, suggestions, and - heck - ",
                "even complaints. We can be easily contacted by email.",
            ),

            d.p(
                {},
                d.a({href: "mailto:feedback@canyons.io"}, "feedback@canyons.io")
            )
        );
    }
}
