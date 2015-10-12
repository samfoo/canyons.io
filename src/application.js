import React from 'react';

var d = React.DOM;

export default class Application extends React.Component {
  render() {
    return d.div(
        {className: "wrapper"},
        "Hello, world",
        this.props.children
    );
  }
}
