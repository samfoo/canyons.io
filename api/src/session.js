import express from "express";
import passport from "passport";

const router = express.Router();
export function required(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

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

export const routes = router;
