"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.schema = undefined;
exports.validate = validate;

var _revalidator = require("revalidator");

var _revalidator2 = _interopRequireDefault(_revalidator);

var _immutable = require("immutable");

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = exports.schema = {
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

function validate(user) {
    var results = _revalidator2.default.validate(user, schema);
    var errors = _immutable2.default.fromJS(results.errors);

    return errors.reduce(function (m, e) {
        var msgs = m.get(e.get("property"), _immutable2.default.Set()).add(e.get("message"));
        return m.set(e.get("property"), msgs);
    }, _immutable2.default.Map()).toJS();
}