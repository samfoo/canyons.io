var canyons = require("./views/canyons"),
    React = require("react"),
    director = require("director");

var routes = {
    "/canyons/new": canyons.views.form
}

var router = director.Router(routes);
router.configure({html5history: true});
router.init();
