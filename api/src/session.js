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
    scrypt.kdf(password, { maxtime: 2.0, N: 1, r:1, p:1 }).then(result => {
        let crypted = result.toString("base64");
        let select = users.select(users.id, users.email)
                          .from(users)
                          .where(users.password.equals(crypted))
                          .toString();

        return db.query(select);
    })
    .then(user => {
        if (user.length > 0) {
            done(null, user);
        } else {
            done(null, null);
        }
    })
    .catch(err => {
        done(err);
    });
};

router.post("/", passport.authenticate("local"), (req, res) => {
    res.send({});
});

router.get("/", (req, res) => {
    res.send(req.user || {});
});

export default {
    routes: router,
    required: required,
    authenticate: authenticate
};
