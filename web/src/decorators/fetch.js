import React from "react";

export default function(fn) {
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

