import * as CanyonActions from "../../actions/canyon";
import React from "react";
import { fetch } from "../../decorators";
import { connect } from "react-redux";

var d = React.DOM;

@fetch((store) => {
    if (!store.loaded("canyons.list")) {
        return store.dispatch(CanyonActions.getCanyons())
    }
})
@connect(state => ({canyons: state.canyons.get("list")}))
export default class Home extends React.Component {
    render() {
        return d.div(
            {id: "hero"},
            d.div({id: "hero-background"}),
            d.div(
                {id: "hero-foreground"},
                d.h1({}, "canyons.io"),
                d.h2({}, "The collaborative canyoning database")
            )
        );
    }
}
