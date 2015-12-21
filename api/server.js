require("babel-register");

var debug = require("debug")("canyons"),
    app = require("./src/server").app;

app.set("port", process.env.PORT || 5678);

var server = app.listen(app.get("port"), function() {
  debug("canyons-api listening on port " + server.address().port);
});

