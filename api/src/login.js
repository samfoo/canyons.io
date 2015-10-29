import passport from "passport";
import express from "express";

const router = express.Router();
const required = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
};

router.post("/", passport.authenticate("local"), (req, res) => {
    res.send({});
});

router.get("/", (req, res) => {
    res.send(req.user || {});
});

export default {
    routes: router,
    required: required
};
