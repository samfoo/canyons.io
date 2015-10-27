import * as CanyonActions from "../../actions/canyon";
import React from "react";
import { fetch } from "../../decorators";
import { connect } from "react-redux";
import { Link } from "react-router";

var d = React.DOM;

const link = (props, ...children) => {
    return React.createElement(
        Link, props, ...children
    );
}

@fetch((store) => {
    if (!store.loaded("canyons.list")) {
        return store.dispatch(CanyonActions.getCanyons())
    }
})
@connect(state => ({canyons: state.canyons.get("list")}))
export default class Home extends React.Component {
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
                    canyons.map((c) => d.li({key: c.get("id")},
                                            link({to: `/canyons/${c.get("id")}`}, c.get("name"))))
                ),
                d.button({}, link({to: "/canyons/new"}, "Add a new canyon"))
            )
        );
    }
}
