import * as db from "./db";
import { User } from "models";
import Immutable from "immutable";
import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
    let data = req.body;
    let errors = Immutable.fromJS(User.validate(data));

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

