import * as CanyonActions from "../../actions/canyon";
import * as canyon from "models/canyon";
import * as forms from "../forms";
import Immutable from "immutable";
import React from "react";
import { connect } from "react-redux";

var d = React.DOM;

@connect(state => ({canyons: state.canyons}))
export default class CanyonForm extends React.Component {
    static deps = [
        CanyonActions.getCanyon
    ];

    render() {
        const { canyons } = this.props;
        const canyon = canyons.get(this.props.params.id);

        return d.div(
            {className: "canyon"},
            d.h1({className: "name"}, canyon.get("name")),

            d.h2({}, "Access"),
            d.p({}, canyon.get("access")),

            d.h2({}, "Track Notes"),
            d.p({}, canyon.get("notes"))
        );
    }
}

