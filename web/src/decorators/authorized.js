import React from "react";

export function decorator(predicate) {
    let authorize = (user, callback) => {
        predicate(user) ? callback() : callback({status: 403});
    };
    return AuthorizationComponent => class D extends React.Component {
        static contextTypes = {
            store: React.PropTypes.object.isRequired
        }

        static onEnter = store => {
            return (state, _, callback) => {
                if (AuthorizationComponent.onEnter) {
                    AuthorizationComponent.onEnter(store)(state, _, err => {
                        if (err) return callback(err);

                        authorize(store.getState().users.get("current"), callback);
                    });
                } else {
                    authorize(store.getState().users.get("current"), callback);
                }
            };
        }

        render() {
            return React.createElement(
                AuthorizationComponent, {...this.props}
            );
        }
    };
}
