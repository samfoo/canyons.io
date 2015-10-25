const base = "http://api:5678";

export default (resource) => {
    return `${base}/${resource}`;
};
