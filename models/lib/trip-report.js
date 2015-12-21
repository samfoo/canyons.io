"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.validate = exports.schema = undefined;

var _revalidator = require("revalidator");

var _revalidator2 = _interopRequireDefault(_revalidator);

var _immutable = require("immutable");

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = exports.schema = {
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
};

var validate = exports.validate = function validate(tripReport) {
    var results = _revalidator2.default.validate(tripReport, schema);
    var errors = _immutable2.default.fromJS(results.errors);

    return errors.reduce(function (m, e) {
        var msgs = m.get(e.get("property"), _immutable2.default.Set()).add(e.get("message"));
        return m.set(e.get("property"), msgs);
    }, _immutable2.default.Map()).toJS();
};