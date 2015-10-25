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

router.get("/:id", (req, res) => {
    let select = canyons.select(canyons.star())
                        .from(canyons)
                        .where(canyons.id.equals(req.params.id))
                        .toString();

    db.query(select).then((r) => {
        if (r.length > 0) {
            res.status(200).send(r[0]);
        } else {
            res.status(404).end();
        }
    })
    .catch((err) => res.status(500).send({error: err}));
});

router.post("/", (req, res) => {
    let errors = canyon.validate(req.body);
    let c = req.body;

    if (hasNo(errors)) {
        let insert = canyons.insert(
            canyons.name.value(c.name),
            canyons.access.value(c.access),
            canyons.notes.value(c.notes)
        ).returning("*").toString();

        db.query(insert).then((r) => res.status(200).send(r[0]))
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
