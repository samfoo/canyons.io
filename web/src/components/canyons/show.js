import * as CanyonActions from "../../actions/canyon";
import Immutable from "immutable";
import React from "react";
import { connect } from "react-redux";
import { fetch } from "../../decorators";
import { notFoundWhen } from "../decorators";

var d = React.DOM;

@fetch((store, r) => {
    if (!store.loaded(`canyons.ids.${r.params.id}`)) {
        return store.dispatch(CanyonActions.getCanyon(r.params))
    }
})
@connect(state => ({canyons: state.canyons}))
export default class CanyonForm extends React.Component {
    static exists = (props, store) => {
        return store.getState().canyons.getIn(["ids", props.params.id]);
    };

    canyon() {
        const { canyons } = this.props;
        return canyons.getIn(["ids", this.props.params.id]);
    }

    @notFoundWhen((c) => !c.canyon())
    render() {
        return d.div(
            {className: "canyon"},
            d.h1({className: "name"}, this.canyon().get("name")),

            d.h2({}, "Access"),
            d.p({}, this.canyon().get("access")),

            d.h2({}, "Track Notes"),
            d.p({}, this.canyon().get("notes"))
        );
    }
}

