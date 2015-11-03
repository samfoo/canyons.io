import db from "./db";
import express from "express";
import passport from "passport";
import scrypt from "scrypt";
import sql from "sql";

const router = express.Router();
const required = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
};

const users = sql.define({
    name: "users",
    columns: ["id", "email", "password"]
});

const authenticate = (email, password, done) => {
    let select = users.select(users.id, users.email, users.password)
                      .from(users)
                      .where(users.email.equals(email))
                      .toString();

    db.one(select)
        .then(user => {
            return scrypt.verifyKdf(new Buffer(user.password, "base64"), new Buffer(password)).then(matching => {
                if (matching) {
                    delete user["password"];
                    done(null, user);
                } else {
                    done(null, null);
                }
            })
            .catch(err => {
                done(err);
            });
        })
        .catch(() => done(null, null));
};

router.post("/logout", (req, res) => {
    req.logout();
    res.send({});
});

router.post("/", passport.authenticate("local"), (req, res) => {
    res.send(req.user);
});

router.get("/", (req, res) => {
    res.send(req.user || {});
});

export default {
    routes: router,
    required: required,
    authenticate: authenticate
};
