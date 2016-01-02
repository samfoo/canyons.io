import Immutable from "immutable";
import v from "revalidator";

export const schema = {
    properties: {
        name: {
            required: true,
            allowEmpty: false,
            type: "string"
        },

        badges: {
            type: "array",
            items: {
                type: "string",
                enum: [
                    "cold",
                    "wetsuit",
                    "swim",
                    "rope",
                    "abseil"
                ]
            }
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

export function decorate(canyon) {
    var markdown = require("markdown").markdown;

    return Object.assign(
        {},
        canyon,
        {
            formatted: {
                access: markdown.toHTML(canyon.access),
                notes: markdown.toHTML(canyon.notes)
            }
        }
    );
}

export function validate(canyon) {
    let results = v.validate(canyon, schema);
    let errors = Immutable.fromJS(results.errors);

    return errors.reduce(
        (m, e) => {
            let msgs = m.get(e.get("property"), Immutable.Set()).add(e.get("message"));
            return m.set(e.get("property"), msgs);
        },
        Immutable.Map()
    ).toJS();
}
