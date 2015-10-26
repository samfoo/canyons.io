import * as CanyonActions from "../../actions/canyon";
import React from "react";
import { connect } from "react-redux";

var d = React.DOM;

const fetch = function(fn) {
    return DecoratedComponent => class ConnctorDecorate extends React.Component {
        static DecoratedComponent = DecoratedComponent;

        static onEnter = store => {
            return (state, _, callback) => {
                let load = fn(store, state);

                if (typeof load !== 'undefined') {
                    load
                        .then(() => callback())
                        .catch(err => callback(err));
                } else {
                    callback();
                }
            }
        }

        render() {
            return React.createElement(
                DecoratedComponent, {...this.props}
            );
        }
    };
};

@fetch((store, r) => {
    let loaded = store.getState().canyons.get("@@server/list");

    if (!loaded) {
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
