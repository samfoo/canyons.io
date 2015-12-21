import React from "react";

export function decorator(predicate) {
    return ResourceComponent => class D extends React.Component {
        static contextTypes = {
            store: React.PropTypes.object.isRequired
        }

        static onEnter = store => {
            return (state, _, callback) => {
                if (ResourceComponent.onEnter) {
                    ResourceComponent.onEnter(store)(state, _, err => {
                        if (err) return callback(err);

                        if (predicate(store, state)) {
                            callback();
                        } else {
                            callback({status: 404});
                        }
                    });
                }
            };
        }

        render() {
            return React.createElement(
                ResourceComponent, {...this.props}
            );
        }
    };
}
