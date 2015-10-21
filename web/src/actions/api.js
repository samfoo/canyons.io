import url from "url";
import path from "path";

const base = url.parse(`http://api:5678`);

export default (resource) => {
    let pathname = path.join(base.pathname, resource);
    base.pathname = pathname;

    return url.format(base);
};
