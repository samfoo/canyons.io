import express from 'express';

const router = express.Router();

router.post("/", (req, res) => {
    console.error("TODO - create a canyon in the DB", req);
    res.status(200).send(req.body);
});

export default {
    routes: router
}
