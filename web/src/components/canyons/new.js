import * as CanyonActions from "../../actions/canyon";
import * as forms from "../forms";
import * as links from "../../utils/links";
import Immutable from "immutable";
import React from "react";
import { CanyonForm } from "./form";
import { authorized } from "../../decorators";
import { connect } from "react-redux";

var d = React.DOM;

@authorized(user => !user.isEmpty())
@connect(state => state)
export class NewCanyon extends forms.ValidatedForm {
    constructor(props, context) {
        super(props, context);
    }

    send(model) {
        let { dispatch } = this.props;

        return dispatch(CanyonActions.createCanyon(model.delete("errors"))).then(c => {
            this.props.history.pushState({}, links.canyons.show(Immutable.fromJS(c)));
        });
    }

    render() {
        return d.div(
            {id: "new-canyon"},
            React.createElement(
                CanyonForm,
                {
                    send: this.send.bind(this),
                    model: Immutable.Map()
                }
            )
        );
    }
}
