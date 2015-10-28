import * as CanyonActions from "../../actions/canyon";
import Immutable from "immutable";
import React from "react";
import { connect } from "react-redux";
import { fetch, resourceRequired } from "../../decorators";

var d = React.DOM;

@resourceRequired((store, r) => store.loaded(`canyons.ids.${r.params.id}`))
@fetch((store, r) => {
    let resources = [];

    if (!store.loaded(`canyons.images.ids.${r.params.id}`)) {
        // todo: resolve to default image when 404
        resources.push(store.dispatch(CanyonActions.getCanyonImages(r.params.id)));
    }
    if (!store.loaded(`canyons.ids.${r.params.id}`)) {
        resources.push(store.dispatch(CanyonActions.getCanyon(r.params.id)));
    }

    return Promise.all(resources);
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

    images() {
        const { canyons } = this.props;
        return canyons.getIn(["images", "ids", this.props.params.id]);
    }

    render() {
        return d.div(
            {className: "canyon"},

            d.img({className: "cover", src: this.images().first().get("secure_url")}),

            d.h1({className: "name"}, this.canyon().get("name")),

            d.h2({}, "Access"),
            d.p({}, this.canyon().get("access")),

            d.h2({}, "Track Notes"),
            d.p({}, this.canyon().get("notes"))
        );
    }
}

