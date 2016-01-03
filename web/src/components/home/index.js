import * as CanyonActions from "../../actions/canyon";
import * as links from "../../utils/links";
import React from "react";
import { Link } from "react-router";
import { User } from "models";
import { connect } from "react-redux";
import { fetch } from "../../decorators";

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
@connect(state => ({
    currentUser: state.users.get("current"),
    canyons: state.canyons.get("list")
}))
export class Home extends React.Component {
    render() {
        let { canyons, currentUser } = this.props;

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

                User.can(currentUser, "create-canyon") ?
                    link({to: links.canyons.new()}, d.button({}, "Add a new canyon")) :
                    null
            )
        );
    }
}
