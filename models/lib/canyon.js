"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.schema = undefined;
exports.decorate = decorate;
exports.validate = validate;

var _immutable = require("immutable");

var _immutable2 = _interopRequireDefault(_immutable);

var _revalidator = require("revalidator");

var _revalidator2 = _interopRequireDefault(_revalidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = exports.schema = {
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
                enum: ["cold", "wetsuit", "swim", "rope", "abseil"]
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

function decorate(canyon) {
    var markdown = require("markdown").markdown;

    return Object.assign({}, canyon, {
        formatted: {
            access: markdown.toHTML(canyon.access),
            notes: markdown.toHTML(canyon.notes)
        }
    });
}

function validate(canyon) {
    var results = _revalidator2.default.validate(canyon, schema);
    var errors = _immutable2.default.fromJS(results.errors);

    return errors.reduce(function (m, e) {
        var msgs = m.get(e.get("property"), _immutable2.default.Set()).add(e.get("message"));
        return m.set(e.get("property"), msgs);
    }, _immutable2.default.Map()).toJS();
}