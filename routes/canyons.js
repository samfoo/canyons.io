var express = require("express"),
    React = require("react"),
    router = express.Router();

router.get("/", function(req, res) {
    res.send("respond with a resource");
});

router.get("/new", function(req, res) {
    var canyons = require("../client/canyons"),
        renderedForm = React.renderToString(
            React.createElement(canyons.Form, {})
        );

    res.render("canyons/form", {form: renderedForm});
});

module.exports = router;
