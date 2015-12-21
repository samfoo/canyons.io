import * as CanyonActions from "../../actions/canyon";
import * as links from "../../utils/links";
import React from "react";
import { fetch } from "../../decorators";
import { connect } from "react-redux";
import { Link } from "react-router";

var d = React.DOM;

const link = (props, ...children) => {
    return React.createElement(
        Link, props, ...children
    );
};

@fetch((store) => {
    if (!store.loaded("canyons.list")) {
        return store.dispatch(CanyonActions.getCanyons());
    }
})
@connect(state => ({canyons: state.canyons.get("list")}))
export class Home extends React.Component {
    render() {
        let { canyons } = this.props;

        return d.div(
            {id: "home"},
            d.div(
                {id: "hero"},
                d.div({id: "hero-background"}),
                d.div(
                    {id: "hero-foreground"},
                    d.h1({}, "canyons.io"),
                    d.h2({}, "The collaborative canyoning database")
                )
            ),
            d.div(
                {id: "home-content"},
                d.h2({}, "Recent Canyons"),
                d.ul(
                    {className: "canyons"},
                    canyons.map(c => {
                        return d.li(
                            {key: c.get("id")},
                             link(
                                 {to: links.canyons.show(c)},
                                 c.get("name")
                             )
                        );
                    })
                ),
                link({to: links.canyons.new()}, d.button({}, "Add a new canyon"))
            )
        );
    }
}
