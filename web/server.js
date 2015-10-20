require("babel/register");

var debug = require("debug")("canyons-web"),
    app = require("./src/server").app;

app.set("port", process.env.PORT || 3000);

var server = app.listen(app.get("port"), "0.0.0.0", function() {
    debug("canyons-web listening on port " + server.address().port);
});
