import React from "react";

var d = React.DOM;

export default class NotFound extends React.Component {
    static exists = () => false;

    render() {
        return d.div(
            {},
            "not found, please try again "
        );
    }
}
