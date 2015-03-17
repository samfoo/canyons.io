var express = require("express"),
    React = require("react"),
    router = express.Router();

router.get("/", function(req, res) {
    res.send("respond with a resource");
});

router.get("/new", function(req, res) {
    var canyons = require("../views/canyons"),
        rendered = React.renderToString(
            React.createElement(canyons.Form, {})
        );

    res.render("layout", {rendered: rendered});
});

module.exports = router;
