import spinner from "./spinner";
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
            {className: [this.props.name, "field", this.state.focus ? "focus" : "", this.errorClass()].join(" ") },
            d.label({htmlFor: this.props.name}, this.props.label),
            d.input(Object.assign({
                onFocus: () => this.setState({focus: true}),
                onBlur: () => this.setState({focus: false})
            }, this.props)),
            this.hasErrors() ? d.div({className: `error-message ${this.props.name}-error`}, this.errorMessages()) : null
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
                className: "real " + this.props.className,
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
            this.hasErrors() ? d.div({className: `error-message ${this.props.name}-error`}, this.errorMessages()) : null
        );
    }
}

export const textarea = function(label, name, options) {
    let props = Object.assign({}, options, {label: label, name: name});
    return React.createElement(TextArea, props);
};

export class FileUploader extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    componentDidMount() {
        window.addEventListener("drop", (e) => e.preventDefault(), false);
        window.addEventListener("dragover", (e) => e.preventDefault(), false);
    }

    componentWillUnmount() {
        window.removeEventListener("drop", (e) => e.preventDefault());
        window.removeEventListener("dragover", (e) => e.preventDefault());
    }

    stateClasses() {
        let { error, finished, dragging, loading } = this.state;
        let classes = [
            [error, "error"],
            [finished, "finished"],
            [loading, "loading"],
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
}

class ImageUploader extends FileUploader {
    static MaxWidth = 800;

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    resize(data) {
        let img = new Image();
        img.onload = () => {
            let canvas = document.createElement("canvas");

            canvas.width = ImageUploader.MaxWidth;
            canvas.height = canvas.width * (img.height / img.width);

            let ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            if (this.props.onChange) {
                this.props.onChange({
                    target: {
                        value: canvas.toDataURL("image/jpeg")
                    }
                });
            }

            this.setState({
                image: canvas.toDataURL("image/jpeg"),
                loading: false,
                finished: true
            });
        };

        img.src = data;
    }

    setFile(file) {
        this.setState({
            loading: true
        });

        let reader = new FileReader();

        reader.onload = (e) => this.resize(e.target.result);

        reader.readAsDataURL(file);
    }

    render() {
        let img;

        if (this.state.image) {
            img = d.div({className: "image-canvas", style: {
                backgroundImage: "url(" + this.state.image + ")"
            }});
        } else {
            img = d.div({className: "image-canvas"});
        }

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

            d.h2(
                {className: "title"},
                d.div(
                    {className: "heading"},
                    d.i({className: "fa fa-camera-retro"}),
                    this.props.title
                ),
                spinner({
                    style: {
                        display: this.state.loading ? "inline-block" : "none"
                    }
                }),
            ),


            d.h4(
                {className: "error-message"},
                "There was a problem processing the image."
            ),

            img,

            d.input({type: "file", onChange: this.select.bind(this)})
        );
    }
}

export const imageUploader = function(title, props) {
    return React.createElement(ImageUploader, Object.assign({title: title}, props));
};
