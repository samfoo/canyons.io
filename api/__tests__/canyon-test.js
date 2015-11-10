/* eslint-env node, jest */

jest.dontMock("../src/canyon");
jest.setMock("pg-promise", () => () => { return undefined; });
jest.setMock("../src/authentication", {
    required: jest.genMockFn()
});

import bodyParser from "body-parser";
import express from "express";
import request from "supertest";
import model from "models/canyon";
import db from "../src/db";
import cloudinary from "cloudinary";

const auth = require("../src/authentication");
const canyon = require("../src/canyon");

describe("canyons", () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(bodyParser.json({}));
        app.use("/canyons", canyon.routes);
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

