import db from "./db";
import passport from "passport";
import bcrypt from "bcrypt";
import sessionMgt from "express-session";
import { Strategy } from "passport-local";

if (!process.env.SESSION_SECRET) {
    throw new Error("please make sure SESSION_SECRET is set on the environment");
}

if (!process.env.WEB_DOMAIN) {
    throw new Error("please make sure WEB_DOMAIN is set on the environment");
}

var COOKIE_DOMAIN;

if (process.env.NODE_ENV !== "test") {
    let components = process.env.WEB_DOMAIN.split(".");
    var baseDomain = components.slice(components.length - 2);
    COOKIE_DOMAIN = `.${baseDomain[0]}.${baseDomain[1]}`;
}

const auth = (email, password, done) => {
    db.users
        .getByEmail(db.connection, email)
        .then(user => {
            let valid = bcrypt.compareSync(password, user.password);

            if (valid) {
                delete user["password"];
                done(null, user);
            } else {
                done(null, null);
            }
        })
        .catch(() => done(null, null));
};

passport.use(
    new Strategy(
        {
            usernameField: "email",
            passwordField: "password"
        },
        auth
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.users
        .get(db.connection, id)
        .then(user => done(null, user))
        .catch(e => done(e));
});

export default {
    required: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.status(401).send({error: "unauthorized"});
        }
    },

    initialize: (app) => {
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
    }
};
