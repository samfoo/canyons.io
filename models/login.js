import v from "revalidator";
import Immutable from "immutable";

export const schema = {
    properties: {
        email: {
            required: true,
            allowEmpty: false,
            type: "string"
        },

        password: {
            required: true,
            allowEmpty: false,
            type: "string"
        }
    }
};

export const validate = function(login) {
    let results = v.validate(login, schema);
    let errors = Immutable.fromJS(results.errors);

    return errors.reduce(
        (m, e) => {
            let msgs = m.get(e.get("property"), Immutable.Set()).add(e.get("message"));
            return m.set(e.get("property"), msgs);
        },
        Immutable.Map()
    ).toJS();
};

