var debug = require("debug")("canyons"),
    app = require("./lib/server").app;

app.set("port", process.env.PORT || 3000);

var server = app.listen(app.get("port"), "0.0.0.0", function() {
    debug("canyons-web listening on port " + server.address().port);
});
