var validate = require("validate.js");

module.exports = {
    validate: function(c) {
        return validate(c, {
            name: { presence: true },
            directions: { presence: true },
            tracknotes: { presence: true }
        });
    }
}
