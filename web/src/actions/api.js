import request from "axios";

var base;

if (typeof window === "undefined") {
    base = "http://api:5678";
} else {
    base = `http://${window.API_DOMAIN}:5678`;
}

const CONFIG = {
    withCredentials: true
};

const api = (resource) => {
    return `${base}/${resource}`;
};

export default (cookie) => {
    let headers = {
        "X-Isomorphic-From": typeof window === "undefined" ? "server" : "client"
    };

    if (cookie) {
        headers.cookie = cookie;
    }

    let opts = Object.assign({}, CONFIG, { headers: headers });

    return {
        get: (resource) => {
            return request.get(
                api(resource),
                opts
            );
        },

        post: (resource, data) => {
            return request.post(
                api(resource),
                data,
                opts
            );
        }
    };
};

