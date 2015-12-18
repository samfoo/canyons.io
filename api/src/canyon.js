import * as authentication from "./authentication";
import * as Canyon from "models/canyon";
import * as TripReport from "models/trip-report";
import Immutable from "immutable";
import cloudinary from "cloudinary";
import db from "./db";
import express from "express";
import sql from "sql";
import { markdown } from "markdown";

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

const canyons = sql.define({
    name: "canyons",
    columns: ["id", "name", "access", "notes", "gps"]
});

const canyonImages = sql.define({
    name: "canyon_images",
    columns: ["id", "canyon_id", "cloudinary_response"]
});

router.get("/", (req, res) => {
    let select = canyons.select(canyons.star())
                        .from(canyons)
                        .limit(10)
                        .toString();

    db.query(select).then((r) => {
        res.status(200).send(r);
    })
    .catch((err) => res.status(500).send({error: err}));
});

router.get("/:id/images", (req, res) => {
    let select = canyonImages.select(canyonImages.cloudinary_response)
                            .from(canyonImages)
                            .where(canyonImages.canyon_id.equals(req.params.id))
                            .toString();

    db.query(select).then(r => {
        if (r.length > 0) {
            res.status(200).send(r.map(i => i.cloudinary_response));
        } else {
            res.status(404).end();
        }
    })
    .catch(err => res.status(500).send({error: err}));
});

const tripReports = sql.define({
    name: "trip_reports",
    columns: ["id", "date", "comments", "rating", "canyon_id", "user_id"]
});

router.post("/:id/trip-reports", (req, res) => {
    let errors = Immutable.fromJS(TripReport.validate(req.body));
    let tr = req.body;

    if (errors.isEmpty()) {
        let tripReportSql = tripReports.insert(
            tripReports.date.value(new Date(tr.date)),
            tripReports.comments.value(tr.comments || null),
            tripReports.rating.value(tr.rating),
            tripReports.canyon_id.value(req.params.id),
            tripReports.user_id.value(req.user.id)
        ).returning("*").toString();

        db.query(tripReportSql).then(r => {
            res.status(200).send(r);
        })
        .catch(err => {
            res.status(500).send({error: err});
        });
    } else {
        res.status(400).send({
            message: "invalid canyon",
            errors: errors.toJS()
        });
    }
});

router.get("/:id", (req, res) => {
    let select = canyons.select(canyons.star())
                        .from(canyons)
                        .where(canyons.id.equals(req.params.id))
                        .toString();

    db.query(select).then((r) => {
        if (r.length > 0) {
            let canyon = r[0];
            Object.assign(canyon, {
                formatted: {
                    access: markdown.toHTML(canyon.access),
                    notes: markdown.toHTML(canyon.notes)
                }
            });
            res.status(200).send(canyon);
        } else {
            res.status(404).end();
        }
    })
    .catch((err) => res.status(500).send({error: err}));
});

router.post("/", authentication.required, (req, res) => {
    let errors = Immutable.fromJS(Canyon.validate(req.body));
    let c = req.body;
    if (errors.isEmpty()) {
        // todo some kind of error handling for cloudinary
        cloudinary.uploader.upload(c.cover, (result) => {
            let canyonSql = canyons.insert(
                canyons.name.value(c.name),
                canyons.access.value(c.access),
                canyons.notes.value(c.notes),
                canyons.gps.value(JSON.stringify(c.gps))
            ).returning("*").toString();

            db.query(canyonSql).then(results => {
                let insertImage = canyonImages.insert(
                    canyonImages.canyon_id.value(results[0].id),
                    canyonImages.cloudinary_response.value(JSON.stringify(result))
                ).returning("*").toString();

                db.query(insertImage);
                return results[0];
            })
            .then(r => {
                res.status(200).send(r);
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

export default {
    routes: router
};
