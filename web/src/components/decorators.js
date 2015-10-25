import NotFound from "./not-found";
import React from "react";

export const notFoundWhen = (test) => (target, name, descriptor) => {
    const render = descriptor.value;

    return {
        configurable: true,
        enumerable: false,

        get() {
            if (test(this)) {
                return () => {
                    return React.createElement(NotFound, {});
                }.bind(this);
            } else {
                return render.bind(this);
            }
        }
    };
};

