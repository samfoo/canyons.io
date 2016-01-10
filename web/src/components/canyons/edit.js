import * as CanyonActions from "../../actions/canyon";
import * as links from "../../utils/links";
import Immutable from "immutable";
import React from "react";
import { CanyonForm } from "./form";
import { authorized } from "../../decorators";
import { connect } from "react-redux";
import { fetch, resourceRequired } from "../../decorators";

@authorized(user => !user.isEmpty())
@resourceRequired((store, r) => {
    return store.loaded(`canyons.ids.${r.params.id}`) &&
        store.loaded(`canyons.images.ids.${r.params.id}`);
})
@fetch((store, r) => {
    let resources = [];

    if (!store.loaded(`canyons.images.ids.${r.params.id}`)) {
        resources.push(store.dispatch(CanyonActions.getCanyonImages(r.params.id)));
    }

    if (!store.loaded(`canyons.ids.${r.params.id}`)) {
        resources.push(store.dispatch(CanyonActions.getCanyon(r.params.id)));
    }

    if (resources.length > 0 ) {
        return Promise.all(resources);
    }
})
@connect(state => ({
    canyons: state.canyons
}))
export class EditCanyon extends React.Component {
    constructor(props, context) {
        super(props, context);

        const { canyons } = this.props;
        const images = canyons.getIn(["images", "ids", this.props.params.id]);
        const model = canyons.getIn(["ids", this.props.params.id]);
        this.state = {
            model: model.set("cover", images.first().get("secure_url"))
        };
    }

    send(model) {
        let { dispatch } = this.props;

        return dispatch(CanyonActions.updateCanyon(
            this.props.params.id,
            model.delete("errors")
                .delete("cover") // todo - form this submit better.
                .delete("id")
                .delete("formatted")
                .delete("slug")
        )).then(c => {
            this.props.history.pushState({}, links.canyons.show(Immutable.fromJS(c)));
        });
    }

    render() {
        return React.createElement(
            CanyonForm,
            {
                send: this.send.bind(this),
                model: this.state.model
            }
        );
    }
}
