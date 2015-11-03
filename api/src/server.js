import bodyParser from "body-parser";
import db from "./db";
import express from "express";
import logger from "morgan";
import passport from "passport";
import sessionMgt from "express-session";
import { Strategy } from "passport-local";

// routes...
import session from "./session";
import canyon from "./canyon";
import user from "./user";

if (!process.env.SESSION_SECRET) {
    throw new Error("please make sure SESSION_SECRET is set on the environment");
}

if (!process.env.API_DOMAIN) {
    throw new Error("please make sure API_DOMAIN is set on the environment");
}

if (!process.env.WEB_DOMAIN) {
    throw new Error("please make sure WEB_DOMAIN is set on the environment");
}

let components = process.env.WEB_DOMAIN.split(".");
var baseDomain = components.slice(components.length - 2);
const COOKIE_DOMAIN = `.${baseDomain[0]}.${baseDomain[1]}`;

passport.use(
    new Strategy(
        {usernameField: "email", passwordField: "password"},
        session.authenticate
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    let select = user.table.select(user.table.star())
                            .where(user.table.id.equals(id))
                            .toString();

    db.one(select)
        .then(user => done(null, user))
        .catch(e => done(e));
});

export var app = express();

// TODO - make this environment dependent on how the app is started.
app.use(logger("dev"));
app.use(bodyParser.json({limit: "3mb"}));
app.use(
    sessionMgt({
        name: "canyons.sid",
        cookie: {
            domain: COOKIE_DOMAIN,
            path: "/",
            httpOnly: false
        },
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true
    })
);
app.use(passport.initialize());
app.use(passport.session());

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
