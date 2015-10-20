import React from "react";
import ReactDOM from "react-dom";

var d = React.DOM;

class Text extends React.Component {
    render() {
        var inputProps = Object.assign(
            {},
            this.props,
            {className: this.props.errorClass, type: "text"}
        );

        return d.div(
            {className: "field"},
            d.label({htmlFor: this.props.name}, this.props.label),
            d.input(inputProps),
            d.div(
                {className: "error-message", style: this.props.errorStyle},
                this.props.errorMessage
            )
        );
    }
}

export const text = function(label, name, options) {
    let props = Object.assign({}, options, {label: label, name: name});
    return React.createElement(Text, props);
};

class TextAreaAutoresize extends React.Component {
    constructor(props) {
        super(props);
        this.state = {height: "0px"};
    }

    real() {
        return ReactDOM.findDOMNode(this).getElementsByClassName("real")[0];
    }

    heightProxy() {
        return ReactDOM.findDOMNode(this).getElementsByClassName("heightProxy")[0];
    }

    resizeToHeightProxy() {
        var heightProxy = this.heightProxy();

        heightProxy.style.height = "0px";
        var scrollHeight = heightProxy.scrollHeight;
        this.setState({height: scrollHeight + "px"});
    }

    resizeToValue() {
        var real = this.real(),
            heightProxy = this.heightProxy();

        heightProxy.value = real.value;
        this.resizeToHeightProxy();
    }

    resizeToPlaceholder() {
        var real = this.real(),
            heightProxy = this.heightProxy();

        if (real.attributes.placeholder) {
            heightProxy.value = real.attributes.placeholder.value;
            this.resizeToHeightProxy();
        }
    }

    resize() {
        if (ReactDOM.findDOMNode(this).getElementsByClassName("real")[0].value) {
            this.resizeToValue();
        } else {
            this.resizeToPlaceholder();
        }
    }

    changed(e) {
        this.resize();
        if (this.props.onChange) {
            this.props.onChange(e);
        }
    }

    componentDidMount() {
        this.resize();
    }

    render() {
        let textareaProps = Object.assign(
            {},
            this.props,
            {
                className: "real " + this.props.inputClass,
                onChange: this.changed.bind(this),
                style: {
                    overflow: "hidden",
                    height: this.state.height
                }
            }
        );

        return d.div({style: {position: "relative"}},
            d.textarea({
                className: "heightProxy",
                style: {
                    overflow: "hidden",
                    visibility: "hidden",
                    position: "absolute"
                }
            }),

            d.textarea(textareaProps)
        );
    }
}

class TextArea extends React.Component {
    render() {
        return d.div(
            {className: "field"},

            d.label({htmlFor: this.props.name}, this.props.label),

            React.createElement(TextAreaAutoresize, this.props),

            d.div(
                {className: "error-message", style: this.props.errorStyle},
                this.props.errorMessage
            )
        );
    }
}

export const textarea = function(label, name, options) {
    let props = Object.assign({}, options, {label: label, name: name});
    return React.createElement(TextArea, props);
};
