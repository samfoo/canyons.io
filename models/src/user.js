import v from "revalidator";
import Immutable from "immutable";

export const schema = {
    properties: {
        email: {
            required: true,
            allowEmpty: false,
            type: "string",
            format: "email"
        },

        name: {
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

export function can(user, verb) {
    if (verb === "create-canyon" ||
        verb === "edit-canyon" ||
        verb === "create-trip-report") {
        return !!user && !user.isEmpty();
    } else {
        return false;
    }
}

export function validate(user) {
    let results = v.validate(user, schema);
    let errors = Immutable.fromJS(results.errors);

    return errors.reduce(
        (m, e) => {
            let msgs = m.get(e.get("property"), Immutable.Set()).add(e.get("message"));
            return m.set(e.get("property"), msgs);
        },
        Immutable.Map()
    ).toJS();
}
