export function promises() {
    return (next) => (action) => {
        const { promise, type, ...rest } = action;

        if (!promise) { return next(action); }

        const SUCCESS = type;
        const REQUEST = type + "_REQUEST";
        const FAILURE = type + "_FAILURE";

        next({ ...rest, type: REQUEST });

        return promise.then(res => {
            next({ ...rest, res, type: SUCCESS });
            return res.data;
        })
        .catch(error => {
            next({ ...rest, error, type: FAILURE });
            return error;
        });
    };
}

export function errors() {
    return (next) => (action) => {
        if (action.error) {
            console.error(action);
        } else {
            return next(action);
        }
    }
}
