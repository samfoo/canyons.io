import express from "express";
import Immutable from "immutable";
import db from "./db";
import * as canyon from "models/canyon";

const router = express.Router();

const hasNo = (errors) => Immutable.fromJS(errors).isEmpty();

router.post("/", (req, res) => {
    let errors = canyon.validate(req.body);

    if (hasNo(errors)) {
        res.status(200).send("TODO - SAVE TO DB");
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
