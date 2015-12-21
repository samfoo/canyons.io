import * as authentication from "./authentication";
import Immutable from "immutable";
import cloudinary from "cloudinary";
import * as db from "./db";
import express from "express";
import * as foo from "models";
import { Canyon, TripReport } from "models";

if (typeof process.env.CLOUDINARY_API_KEY === "undefined" ||
    typeof process.env.CLOUDINARY_SECRET_KEY === "undefined") {
    throw new Error("please make sure CLOUDINARY_API_KEY and CLOUDINARY_SECRET_KEY are set on the environment");
}

cloudinary.config({ 
    cloud_name: "adventure",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const router = express.Router();

router.get("/", (req, res) => {
    db.canyons
        .all(db.connection)
        .then(canyons => {
            res.status(200).send(canyons);
        })
        .catch(err => res.status(500).send({error: err}));
});

router.get("/:id/images", (req, res) => {
    db.canyons.images
        .getForCanyon(db.connection, req.params.id)
        .then(images => {
            res.status(200).send(images.map(i => i.cloudinary_response));
        })
        .catch(err => res.status(500).send({error: err}));
});

router.get("/:id/trip-reports", (req, res) => {
    db.canyons.tripReports
        .getForCanyon(db.connection, req.params.id)
        .then(tripReports => {
            res.status(200).send(tripReports);
        })
        .catch(err => res.status(500).send({error: err}));
});

router.post("/:id/trip-reports", authentication.required, (req, res) => {
    let data = req.body;
    let errors = Immutable.fromJS(TripReport.validate(data));

    if (errors.isEmpty()) {
        db.canyons
            .get(db.connection, req.params.id)
            .then(canyon => {
                return db.canyons.tripReports
                    .createForUserAndCanyon(
                        db.connection,
                        req.user.id,
                        canyon.id,
                        data
                    );
            })
            .then(tripReport => {
                res.status(200).send(tripReport);
            })
            .catch(err => res.status(500).send({error: err}));
    } else {
        res.status(400).send({
            message: "invalid canyon",
            errors: errors.toJS()
        });
    }
});

router.get("/:id", (req, res) => {
    db.canyons
        .get(db.connection, req.params.id)
        .then(canyon => {
            if (canyon) {
                res.status(200).send(canyon);
            } else {
                res.status(404).end();
            }
        })
        .catch(err => {
            res.status(500).send({error: err});
        });
});

router.post("/", authentication.required, (req, res) => {
    let data = req.body;
    let errors = Immutable.fromJS(Canyon.validate(data));

    if (errors.isEmpty()) {
        // todo some kind of error handling for cloudinary
        cloudinary.uploader.upload(data.cover, result => {
            db.canyons
                .create(db.connection, data)
                .then(canyon => {
                    db.canyons.images
                        .createForCanyon(db.connection, canyon.id, result);

                    // Creating the images can happen in the background, it
                    // should be done by the time the canyon details are
                    // requested.
                    res.status(200).send(canyon);
                })
                .catch(err => {
                    res.status(500).send({error: err});
                });
        });
    } else {
        res.status(400).send({
            message: "invalid canyon",
            errors: errors.toJS()
        });
    }
});

export const routes = router;

