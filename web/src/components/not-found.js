import React from "react";

var d = React.DOM;

export class NotFound extends React.Component {
    static exists = () => false;

    render() {
        return d.div(
            {},
            "not found"
        );
    }
}
