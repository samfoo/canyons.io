import React from "react";
import ReactDOM from "react-dom";

var d = React.DOM;

class Field extends React.Component {
    errorClass() {
        return this.hasErrors() ? "error" : "";
    }

    hasErrors() {
        return !this.props.errors.isEmpty();
    }

    errorMessages() {
        return this.props.errors.join(", ");
    }
}

class Text extends Field {
    constructor(props, context) {
        super(props, context);
        this.state = {focus: false};
    }

    render() {
        return d.div(
            {className: ["field", this.state.focus ? "focus" : "", this.errorClass()].join(" ") },
            d.label({htmlFor: this.props.name}, this.props.label),
            d.input(Object.assign({
                onFocus: () => this.setState({focus: true}),
                onBlur: () => this.setState({focus: false})
            }, this.props)),
            d.div(
                {
                    className: "error-message",
                    style: {
                        display: this.hasErrors() ? "block" : "none"
                    }
                },
                this.errorMessages()
            )
        );
    }
}

export const text = function(label, name, options) {
    let props = Object.assign({}, options, {label: label, name: name, type: "text"});
    return React.createElement(Text, props);
};

export const password = function(label, name, options) {
    let props = Object.assign({}, options, {label: label, name: name, type: "password"});
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

class TextArea extends Field {
    constructor(props, context) {
        super(props, context);
        this.state = {focus: false};
    }

    render() {
        return d.div(
            {className: ["field", this.state.focus ? "focus" : "", this.errorClass()].join(" ") },
            d.label({htmlFor: this.props.name}, this.props.label),
            React.createElement(TextAreaAutoresize, Object.assign({}, {
                onFocus: () => this.setState({focus: true}),
                onBlur: () => this.setState({focus: false})
            }, this.props)),
            d.div(
                {
                    className: "error-message",
                    style: {
                        display: this.hasErrors() ? "block" : "none"
                    }
                },
                this.errorMessages()
            )
        );
    }
}

export const textarea = function(label, name, options) {
    let props = Object.assign({}, options, {label: label, name: name});
    return React.createElement(TextArea, props);
};

class ImageUploader extends React.Component {
    static MaxWidth = 1024;

    constructor(props, context) {
        super(props, context);
        this.state = {
            image: "/img/example-canyon.jpg"
        };
    }

    componentDidMount() {
        window.addEventListener("drop", this.preventDefault, false);
        window.addEventListener("dragover", this.preventDefault, false);
    }

    componentWillUnmount() {
        window.removeEventListener("drop", this.preventDefault);
        window.removeEventListener("dragover", this.preventDefault);
    }

    preventDefault(e) {
        e.preventDefault();
    }

    stateClasses() {
        let { error, finished, dragging } = this.state;
        let classes = [
            [error, "error"],
            [finished, "finished"],
            [dragging, "dragging"]]
            .filter(s => s[0])
            .map(s => s[1]);

        return classes.concat("upload", "drop-zone").join(" ");
    }

    dragging() {
        this.setState({dragging: true});
    }

    notDragging() {
        this.setState({dragging: false});
    }

    resize(data) {
        let img = new Image();
        img.onload = () => {
            let canvas = document.createElement("canvas");

            canvas.width = ImageUploader.MaxWidth;
            canvas.height = canvas.width * (img.height / img.width);

            let ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            this.setState({
                image: canvas.toDataURL("image/jpeg"),
                finished: true
            });

            if (this.props.onChange) {
                this.props.onChange({
                    target: {
                        value: canvas.toDataURL("image/jpeg")
                    }
                });
            }
        };

        img.src = data;
    }

    setFile(file) {
        let reader = new FileReader();

        reader.onload = function(e) {
            this.resize(e.target.result);
        }.bind(this);

        reader.readAsDataURL(file);
    }

    select(e) {
        e.stopPropagation();
        e.preventDefault();

        let file = e.target.files[0];
        this.setFile(file);
    }

    drop(e) {
        e.stopPropagation();
        e.preventDefault();

        this.setState({dragging: false});

        let file = e.dataTransfer.files[0];
        this.setFile(file);
    }

    browse() {
        let node = ReactDOM.findDOMNode(this),
            input = node.querySelector("input[type='file']");

        input.click();
    }

    render() {
        return d.div(
            {
                onDragOver: this.dragging.bind(this),
                onDragStart: this.dragging.bind(this),
                onDragEnter: this.dragging.bind(this),
                onDragLeave: this.notDragging.bind(this),
                onDrop: this.drop.bind(this),
                onClick: this.browse.bind(this),
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

            d.input({type: "file", onChange: this.select.bind(this)})
        );
    }
}

export const imageUploader = function(title, props) {
    return React.createElement(ImageUploader, Object.assign({title: title}, props));
};
