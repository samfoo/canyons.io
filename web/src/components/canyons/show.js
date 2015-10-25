import * as CanyonActions from "../../actions/canyon";
import Immutable from "immutable";
import React from "react";
import { connect } from "react-redux";
import { notFoundWhen } from "../decorators";

var d = React.DOM;

@connect(state => ({canyons: state.canyons}))
export default class CanyonForm extends React.Component {
    static deps = [
        CanyonActions.getCanyon
    ];

    static exists = (props, store) => {
        return store.getState().canyons.get(props.params.id);
    };

    canyon() {
        const { canyons } = this.props;
        return canyons.get(this.props.params.id);
    }

    @notFoundWhen((c) => !c.canyon())
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

