import * as canyon from "models/canyon";
import Immutable from "immutable";
import db from "./db";
import express from "express";
import sql from "sql";

const router = express.Router();

const hasNo = (errors) => Immutable.fromJS(errors).isEmpty();

const canyons = sql.define({
    name: "canyons",
    columns: ["id", "name", "access", "notes"]
});

router.post("/", (req, res) => {
    let errors = canyon.validate(req.body);
    let c = req.body;

    if (hasNo(errors)) {
        var insert = canyons.insert(
            canyons.name.value(c.name),
            canyons.access.value(c.access),
            canyons.notes.value(c.notes)
        ).toString();

        console.log("insert is", insert);

        db.query(insert).then((r) => res.status(200).send(r))
                        .catch((err) => res.status(500).send({error: err}));
    } else {
        res.status(400).send({
            message: "invalid canyon",
            errors: errors
        });
    }
});

export default {
    routes: router
};
