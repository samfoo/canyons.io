/* eslint-env node, mocha */

import bodyParser from "body-parser";
import express from "express";
import request from "supertest";
import sinon from "sinon";

const proxyquire = require("proxyquire").noCallThru().noPreserveCache();

describe("/canyons", () => {
    let app;

    let canyon = {
        id: "canyon-id",
        name: "Claustral",
        slug: "canyon-slug",
        access: "Down to Bell's Line of Road\n\n* Then... \n* Next...",
        notes: "Be careful of the tiger snakes\n\nThey're vicious in the summer"
    };

    beforeEach(() => {
        app = express();
        app.use(bodyParser.json({}));
    });

    describe("GET /canyons/:id", () => {
        it("should render the canyon", (done) => {
            let db = {
                connection: {},
                canyons: {
                    get: sinon.stub()
                }
            };

            db.canyons.get.returns(Promise.resolve(canyon));

            let routes = proxyquire("../src/canyon", {
                "./db": db
            }).routes;

            app.use("/canyons", routes);

            request(app)
                .get("/canyons/canyon-id")
                .type("json")
                .expect(200, canyon)
                .end(done);
        });
    });

    describe("POST /canyons", () => {
        describe("when logged in", () => {
            let db = {};
            let cloudinary = {};

            beforeEach(() => {
                db = {
                    canyons: {
                        create: sinon.stub(),
                        images: {
                            createForCanyon: sinon.stub()
                        }
                    }
                };

                cloudinary = {
                    config: sinon.stub()
                };

                let authentication = { required: (req, res, next) => next() };

                let routes = proxyquire("../src/canyon", {
                    "./db": db,
                    "./authentication": authentication,
                    cloudinary: cloudinary
                }).routes;

                app.use("/canyons", routes);
            });

            describe("when canyon is valid", () => {
                it("should upload the cover image to cloudinary", (done) => {
                    cloudinary.uploader = { upload: (_, cb) => cb({}) };
                    db.canyons.create.returns(
                        Promise.resolve([{id: "canyon-id"}])
                    );

                    request(app)
                        .post("/canyons")
                        .type("json")
                        .send(JSON.stringify(canyon))
                        .expect(200)
                        .end(done);
                });
            });

            describe("when canyon is invalid", () => {
                let invalid = {
                    id: "canyon-id",
                    slug: "canyon-slug",
                    access: "Down to Bell's Line of Road\n\n* Then... \n* Next...",
                    notes: "Be careful of the tiger snakes\n\nThey're vicious in the summer"
                };

                it("should respond with a 400 bad request", (done) => {
                    request(app)
                        .post("/canyons")
                        .type("json")
                        .send(JSON.stringify(invalid))
                        .expect(400)
                        .end(done);
                });
            });
        });

        describe("when not logged in", () => {
            it("should respond with a 401 unauthorized", (done) => {
                let db = {};
                let authentication = {
                    required: (req, res) => res.status(401).send({error: "unauthorized"})
                };

                let routes = proxyquire("../src/canyon", {
                    "./db": db,
                    "./authentication": authentication
                }).routes;

                app.use("/canyons", routes);

                request(app)
                    .post("/canyons")
                    .type("json")
                    .send(JSON.stringify({
                        name: "Coinslot",
                        notes: "Climb up a wall...",
                        access: "Go to Newnes..."
                    }))
                    .expect(401)
                    .end(done);
            });
        });
    });
});
