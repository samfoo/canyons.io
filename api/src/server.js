import bodyParser from "body-parser";
import express from "express";
import logger from "morgan";
import * as authentication from "./authentication";

// routes...
import * as session from "./session";
import * as canyon from "./canyon";
import * as user from "./user";

if (!process.env.WEB_DOMAIN) {
    throw new Error("please make sure WEB_DOMAIN is set on the environment");
}

export var app = express();

// TODO - make this environment dependent on how the app is started.
app.use(logger("dev"));
app.use(bodyParser.json({limit: "3mb"}));

authentication.initialize(app);

app.use((req, res, next) => {
    // todo: fix this hardcoding of the port
    res.set("Access-Control-Allow-Origin", `http://${process.env.WEB_DOMAIN}:3000`);
    res.set("Access-Control-Allow-Credentials", "true");
    res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, HEAD, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, X-Isomorphic-From");
    next();
});

app.use("/sessions", session.routes);
app.use("/canyons", canyon.routes);
app.use("/users", user.routes);
