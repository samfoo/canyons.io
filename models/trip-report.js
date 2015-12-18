import v from "revalidator";
import Immutable from "immutable";

export const schema = {
    properties: {
        date: {
            required: true,
            type: "string",
            formate: "date-time"
        },

        rating: {
            required: true,
            type: "integer",
            minimum: 1,
            maximum: 5
        },

        comments: {
            required: false,
            allowEmpty: true,
            type: "string",
            maxLength: 300
        }
    }
}

export const validate = function(tripReport) {
    let results = v.validate(tripReport, schema);
    let errors = Immutable.fromJS(results.errors);

    return errors.reduce(
        (m, e) => {
            let msgs = m.get(e.get("property"), Immutable.Set()).add(e.get("message"));
            return m.set(e.get("property"), msgs);
        },
        Immutable.Map()
    ).toJS();
};
