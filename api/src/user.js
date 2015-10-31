import * as user from "models/user";
import Immutable from "immutable";
import db from "./db";
import express from "express";
import scrypt from "scrypt";
import sql from "sql";

const router = express.Router();

const users = sql.define({
    name: "users",
    columns: ["id", "email", "password"]
});

router.post("/", (req, res) => {
    let u = req.body;
    let errors = Immutable.fromJS(user.validate(u));

    if (errors.isEmpty()) {
        scrypt.kdf(u.password, { maxtime: 2.0, N: 1, r:1, p:1 }).then(result => {
            let insert = users.insert(
                users.email.value(u.email),
                users.password.value(result.toString("base64"))
            ).returning("*").toString();

            return db.query(insert);
        })
        .then(user => {
            if (user.length > 0) {
                delete user[0]['password'];
                req.login(user[0], function() {
                    res.status(200).send(user[0]);
                });
            } else {
                res.status(500).send({
                    message: "unable to create user"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `unable to create user: ${err}`
            });
        });
    } else {
        res.status(400).send({
            message: "invalid user",
            errors: errors
        });
    }
});

export default {
    routes: router,
    table: users
}
