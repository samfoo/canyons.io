import * as user from "models/user";
import Immutable from "immutable";
import db from "./db";
import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
    let data = req.body;
    let errors = Immutable.fromJS(user.validate(data));

    if (errors.isEmpty()) {
        db.users.create(db.connection, data)
            .then(user => {
                delete user["password"];
                req.login(user, function() {
                    res.status(200).send(user);
                });
            })
            .catch(err => {
                res.status(500).send({
                    message: "unable to create user",
                    errors: [err]
                });
            });
    } else {
        res.status(400).send({
            message: "invalid user",
            errors: errors
        });
    }
});

export const routes = router;

