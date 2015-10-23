import url from "url";
import path from "path";

const base = url.parse(`http://api:5678`);

export default (resource) => {
    let clone = url.parse(base.format());
    let pathname = path.join(clone.pathname, resource);
    clone.pathname = pathname;

    return clone.format();
};
