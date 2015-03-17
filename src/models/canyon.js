var revalidator = require("revalidator"),
    r = require("ramda");

var schema = {
    properties: {
        name: {
            required: true,
            allowEmpty: false,
            type: "string"
        },

        directions: {
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

module.exports = {
    validate: function(c) {
        var results = revalidator.validate(c, schema);

        return r.reduce(
            function(m, e) {
                var field = e.property,
                    msg = e.message;

                var msgs = r.append(msg, (m[field] || [])),
                    result = {};

                result[field] = msgs;

                return r.merge(m, result);
            },

            {},

            results.errors
        );
    }
}
