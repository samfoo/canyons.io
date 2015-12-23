import React from "react";

var d = React.DOM;

export class Unauthorized extends React.Component {
    static exists = () => false;

    render() {
        return d.div(
            {},
            "unauthorized"
        );
    }
}
