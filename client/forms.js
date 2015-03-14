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

var ImageUploader = React.createClass({
    getInitialState: function() {
        return {
            image: "../images/example-canyon.jpg"
        };
    },

    componentDidMount: function() {
        window.addEventListener("drop", this.preventDefault, false);
        window.addEventListener("dragover", this.preventDefault, false);
    },

    componentWillUnmount: function() {
        window.removeEventListener("drop", this.preventDefault);
        window.removeEventListener("dragover", this.preventDefault);
    },

    preventDefault: function(e) {
        e.preventDefault();
    },

    stateClasses: function() {
        var keys = ["error", "finished", "dragging"],
            classStates = r.pickAll(keys, this.state),
            classes = r.filter(
                function(s) { return classStates[s]; },
                keys
            );

        return r.join(" ", r.concat(classes, ["upload", "drop-zone"]));
    },

    dragging: function() {
        this.setState({dragging: true});
    },

    notDragging: function() {
        this.setState({dragging: false});
    },

    setFile: function(file) {
        var reader = new FileReader(),
            self = this;

        reader.onload = function(e) {
            self.setState({
                image: e.target.result,
                finished: true
            });
        };

        reader.readAsDataURL(file);
    },

    select: function(e) {
        e.stopPropagation();
        e.preventDefault();

        var file = e.target.files[0];
        this.setFile(file);
    },

    drop: function(e) {
        e.stopPropagation();
        e.preventDefault();

        this.setState({dragging: false});

        var file = e.dataTransfer.files[0];
        this.setFile(file);
    },

    browse: function() {
        var node = React.findDOMNode(this),
            input = node.querySelector("input[type='file']");

        input.click();
    },

    render: function() {
        return d.div(
            {
                onDragOver: this.dragging,
                onDragStart: this.dragging,
                onDragEnter: this.dragging,
                onDragLeave: this.notDragging,
                onDrop: this.drop,
                onClick: this.browse,
                type: "button",
                className: this.stateClasses()
            },

            d.h2({className: "title"}, this.props.title),
            d.h4(
                {className: "error-message"},
                "Oh no! There was a problem uploading."
            ),

            d.div({className: "image-canvas", style: {
                backgroundImage: "url(" + this.state.image + ")"
            }}),

            d.input({type: "file", onChange: this.select})
        )
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

var imageUploader = function(title) {
    return React.createElement(ImageUploader, {title: title});
}

module.exports = {
    text: text,
    textarea: textarea,
    button: button,
    imageUploader: imageUploader
};
