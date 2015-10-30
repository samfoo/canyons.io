import bodyParser from "body-parser";
import express from "express";
import logger from "morgan";
import passport from "passport";
import sessionMgt from "express-session";
import { Strategy } from "passport-local";

// routes...
import session from "./session";
import canyon from "./canyon";

var user = {
    email: "sam@ifdown.net",
    name: "Sam Gibson",
    id: "1"
};

passport.use(
    new Strategy(
        {usernameField: "email", passwordField: "password"},
        session.authenticate
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((session, done) => {
    done(null, user);
});

export var app = express();

// TODO - make this environment dependent on how the app is started.
app.use(logger("dev"));
app.use(bodyParser.json({limit: "3mb"}));
app.use(
    sessionMgt({
        secret: "TODO - Change me to an environment variable",
        resave: false,
        saveUninitialized: true
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.use("/sessions", session.routes);
app.use("/canyons", canyon.routes);
