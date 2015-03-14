var React = require("react"),
    d = React.DOM,
    r = require("ramda");

var Text = React.createClass({
    render: function() {
        return d.div(
            {className: "field"},
            d.label({htmlFor: this.props.name}, this.props.label),
            d.input(r.merge(this.props, {type: "text"}), null)
        );
    }
});

var TextAreaAutoresize = React.createClass({
    getInitialState: function() {
        return {height: "0px"};
    },

    real: function() {
        return React.findDOMNode(this).getElementsByClassName("real")[0];
    },

    shadow: function() {
        return React.findDOMNode(this).getElementsByClassName("shadow")[0];
    },

    resizeToShadow: function() {
        var shadow = this.shadow();

        shadow.style.height = "0px";
        var scrollHeight = shadow.scrollHeight;
        this.setState({height: scrollHeight + "px"});
    },

    resizeToValue: function() {
        var node = React.findDOMNode(this),
            real = this.real(),
            shadow = this.shadow();

        shadow.value = real.value;
        this.resizeToShadow();
    },

    resizeToPlaceholder: function() {
        var node = React.findDOMNode(this),
            real = this.real(),
            shadow = this.shadow();

        shadow.value = real.attributes.placeholder.value;
        this.resizeToShadow();
    },

    resize: function() {
        if (React.findDOMNode(this).getElementsByClassName("real")[0].value) {
            this.resizeToValue();
        } else {
            this.resizeToPlaceholder();
        }
    },

    componentDidMount: function() {
        this.resize();
    },

    render: function() {
        return d.div({style: {position: "relative"}},
            d.textarea({
                className: "shadow",
                style: {overflow: "hidden", visibility: "hidden", position: "absolute"}
            }),
            d.textarea(r.merge(this.props, {
                className: "real",
                onChange: this.resize,
                style: {overflow: "hidden", height: this.state.height}
            }))
        );
    }
});

var TextArea = React.createClass({
    render: function() {
        return d.div(
            {className: "field"},
            d.label({htmlFor: this.props.name}, this.props.label),
            React.createElement(TextAreaAutoresize, this.props)
        );
    }
});

var Button = React.createClass({
    render: function() {
        return d.button(this.props, this.props.label);
    }
});

var text = function(label, name, options) {
    var props = r.merge(options, {label: label, name: name});
    return React.createElement(Text, props);
}

var textarea = function(label, name, options) {
    var props = r.merge(options, {label: label, name: name});
    return React.createElement(TextArea, props);
}

var button = function(label, options) {
    return React.createElement(Button, r.merge({label: label}, options));
}

module.exports = {
    text: text,
    textarea: textarea,
    button: button
};
