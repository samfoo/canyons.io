import * as canyon from "models/canyon";
import Immutable from "immutable";
import cloudinary from "cloudinary";
import db from "./db";
import express from "express";
import sql from "sql";

if (typeof process.env.CLOUDINARY_API_KEY == "undefined" ||
    typeof process.env.CLOUDINARY_SECRET_KEY == "undefined") {
    throw new Error("please make sure CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET are set on the environment");
}

cloudinary.config({ 
    cloud_name: "adventure",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const router = express.Router();

const canyons = sql.define({
    name: "canyons",
    columns: ["id", "name", "access", "notes"]
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
    let errors = Immutable.fromJS(canyon.validate(req.body));
    let c = req.body;

    if (errors.isEmpty()) {
        cloudinary.uploader.upload(c.cover, (result) => {
            var id;

            db.tx((t) => {
                return t.sequence((i, data) => {
                    switch (i) {
                    case 0:
                        let insertCanyon = canyons.insert(
                            canyons.name.value(c.name),
                            canyons.access.value(c.access),
                            canyons.notes.value(c.notes)
                        ).returning("*").toString();

                        return db.query(insertCanyon);

                    case 1:
                        id = data[0].id;
                        let insertImage = canyonImages.insert(
                            canyonImages.canyon_id.value(data[0].id),
                            canyonImages.cloudinary_response.value(JSON.stringify(result))
                        ).returning("*").toString();

                        return db.query(insertImage);
                    }
                });
            }).then(() => {
                return db.one(canyons.select(canyons.star())
                              .from(canyons)
                              .where(canyons.id.equals(id))
                              .toString());
            })
            .then((r) => {
                res.status(200).send(r);
            })
            .catch((err) => {
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
