import React from "react";

var d = React.DOM;

class Spinner extends React.Component {
    render() {
        return d.div(
            Object.assign({className: "spinner"}, this.props),
            d.div({className: "one"}),
            d.div({className: "two"}),
            d.div({className: "three"}),
            d.div({className: "four"})
        );
    }
}

export default function spinner(props={}) {
    return React.createElement(Spinner, props);
};
