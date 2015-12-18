/* eslint-env node, jest */

jest.dontMock("../src/canyon");
jest.setMock("pg-promise", () => () => { return undefined; });
jest.setMock("../src/authentication", {
    required: jest.genMockFn()
});

import bodyParser from "body-parser";
import cloudinary from "cloudinary";
import db from "../src/db";
import express from "express";
import { markdown } from "markdown";
import model from "models/canyon";
import request from "supertest";

const auth = require("../src/authentication");
const canyon = require("../src/canyon");

describe("canyons", () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(bodyParser.json({}));
        app.use("/canyons", canyon.routes);
    });

    describe("GET /canyons/:id", () => {
        describe("when canyon exists", () => {
            pit("should contain formatted access & notes", () => {
                let canyon = {
                    id: "canyon-id",
                    access: "Down to Bell's Line of Road\n\n* Then... \n* Next...",
                    notes: "Be careful of the tiger snakes\n\nThey're vicious in the summer"
                };

                db.query.mockReturnValue(
                    Promise.resolve([canyon])
                );

                return new Promise((resolve, reject) => {
                    request(app)
                        .get("/canyons/canyon-id")
                        .type("json")
                        .expect(200, Object.assign(
                            {},
                            canyon,
                            {
                                formatted: {
                                    access: markdown.toHTML(canyon.access),
                                    notes: markdown.toHTML(canyon.notes)
                                }
                            }
                        ))
                        .end(err => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                });
            });
        });
    });

    describe("POST /canyons", () => {
        describe("when logged in", () => {
            beforeEach(() => {
                auth.required.mockImpl((req, res, next) => {
                    next();
                });

                model.validate.mockReturnValue({});
            });

            describe("when canyon is valid", () => {
                pit("should upload the cover image to cloudinary", () => {
                    cloudinary.uploader.upload.mockImpl((uri, cb) => {
                        cb({});
                    });

                    db.query.mockReturnValue(Promise.resolve([{id: "canyon-id"}]));

                    return new Promise((resolve, reject) => {
                        request(app)
                            .post("/canyons")
                            .type("json")
                            .send(JSON.stringify({}))
                            .expect(200)
                            .end(err => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve();
                                }
                            });
                    });
                });
            });

            describe("when canyon is invalid", () => {
                beforeEach(() => {
                    model.validate.mockReturnValue({
                        name: ["is required"]
                    });
                });

                pit("should respond with a 400 bad request", () => {
                    return new Promise((resolve, reject) => {
                        request(app)
                            .post("/canyons")
                            .type("json")
                            .send(JSON.stringify({}))
                            .expect(400)
                            .end(err => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve();
                                }
                            });
                    });
                });
            });
        });

        describe("when not logged in", () => {
            pit("should respond with a 401 unauthorized", () => {
                auth.required.mockImpl((req, res) => {
                    res.status(401).end();
                });

                return new Promise((resolve, reject) => {
                    request(app)
                        .post("/canyons")
                        .type("json")
                        .send(JSON.stringify({
                            name: "Coinslot",
                            notes: "Climb up a wall...",
                            access: "Go to Newnes..."
                        }))
                        .expect(401)
                        .end(err => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                });
            });
        });
    });
});

