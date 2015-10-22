import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
    // TODO - create a canyon in the DB
    res.status(200).send(req.body);
});

export default {
    routes: router
};
