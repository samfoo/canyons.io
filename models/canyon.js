import v from "revalidator";
import Immutable from "immutable";

export const schema = {
    properties: {
        name: {
            required: true,
            allowEmpty: false,
            type: "string"
        },

        access: {
            required: true,
            allowEmpty: false,
            type: "string"
        },

        notes: {
            required: true,
            allowEmpty: false,
            type: "string"
        }
    }
};

export const validate = function(canyon) {
    let results = v.validate(canyon, schema);
    let errors = Immutable.fromJS(results.errors);

    return errors.reduce(
        (m, e) => {
            let msgs = m.get(e.get("property"), Immutable.Set()).add(e.get("message"));
            return m.set(e.get("property"), msgs);
        },
        Immutable.Map()
    ).toJS();
};
