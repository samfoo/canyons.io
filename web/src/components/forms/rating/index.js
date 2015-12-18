import React from "react";
import Field from "../field";

var d = React.DOM;

class Star extends React.Component {
    classes() {
        let cs = ["fa", "rating-star"];

        let { selected, hovered } = this.props;

        if (hovered) {
            cs.push("fa-star");
            cs.push("hovered");
        } else if (selected) {
            cs.push("fa-star");
            cs.push("selected");
        } else {
            cs.push("fa-star-o");
        }

        return cs.join(" ");
    }

    render() {
        return d.i(Object.assign({className: this.classes()}, this.props));
    }
}

class Rating extends Field {
    constructor(props, context) {
        super(props, context);
        this.state = {rating: 0, focus: false, hoverOver: 0};
    }

    select(rating) {
        this.setState({ rating });

        if (this.props.onChange) {
            this.props.onChange({
                target: {
                    value: rating
                }
            });
        }
    }

    hover(rating) {
        this.setState({
            hoverOver: rating
        });
    }

    unhover(rating) {
        this.setState({
            hoverOver: 0
        });
    }

    render() {
        let stars = [];
        for (let i=1; i<=5; i++) {
            stars.push(React.createElement(Star, {
                selected: this.state.hoverOver === 0 && this.state.rating >= i,
                hovered: this.state.hoverOver >= i,
                key: `star-${i}`,
                onMouseOver: (e) => this.hover(i),
                onMouseOut: (e) => this.unhover(i),
                onClick: (e) => this.select(i)
            }));
        }

        return d.div(
            {className: [
                this.props.name,
                "field",
                this.state.focus ? "focus" : "",
                this.errorClass()
            ].join(" ") },
            d.label({htmlFor: this.props.name}, this.props.label),
            stars,
            this.hasErrors() ? d.div({className: `error-message ${this.props.name}-error`}, this.errorMessages()) : null
        );
    }
}

export default function(label, options) {
    let props = Object.assign({}, options, {label});
    return React.createElement(Rating, props);
}
