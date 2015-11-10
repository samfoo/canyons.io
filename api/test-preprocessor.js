'use strict';

var babel = require("babel-core");

module.exports = {
    process: function (src, filename) {
        // Allow the stage to be configured by an environment
        // variable, but use Babel's default stage (2) if
        // no environment variable is specified.
        var stage = process.env.BABEL_JEST_STAGE || 2;

        var module = filename.indexOf("node_modules") !== -1,
            models = filename.match(/node_modules\/models\/\w+.js$/);

        if (module && !models) {
            return src;
        } else {
            if (babel.canCompile(filename)) {
                return babel.transform(src, {
                    filename: filename,
                    stage: stage,
                    retainLines: true,
                    auxiliaryCommentBefore: "istanbul ignore next"
                }).code;
            } else {
                return src;
            }
        }
    }
};