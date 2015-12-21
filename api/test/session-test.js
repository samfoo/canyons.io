/* eslint-env node, mocha */

import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import express from "express";
import request from "supertest";
import { expect } from "chai";
import { routes } from "../src/session";

const proxyquire = require("proxyquire").noCallThru().noPreserveCache();

describe("/sessions", () => {
    let app;
    let db = { users: { } };
    let user = {
        id: "user-id",
        email: "sam@ifdown.net",
        password: "crypted-password"
    };

    let login = () => {
        let agent = request.agent(app);

        return new Promise((resolve, reject) => {
            agent
                .post("/sessions")
                .type("json")
                .send(JSON.stringify({
                    email: "sam@ifdown.net",
                    password: "password"
                }))
                .expect(200)
                .end(err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(agent);
                    }
                });
        });
    };

    beforeEach(() => {
        app = express();
        app.use(bodyParser.json({limit: "3mb"}));
    });

    describe("POST /sessions/logout", () => {
        beforeEach(() => {
            db.users.get = () => Promise.resolve(user);
            db.users.getByEmail = () => Promise.resolve(user);

            let auth = proxyquire("../src/authentication", {
                bcrypt: { compareSync: () => true },
                "./db": db
            });

            auth.initialize(app);

            app.use("/sessions", routes);
        });

        it("should delete session", (done) => {
            login().then(agent => {
                    agent
                        .post("/sessions/logout")
                        .type("json")
                        .expect(200)
                        .expect({}, done);
                });
        });
    });

    describe("POST /sessions", () => {
        beforeEach(() => {
            db.users.get = () => Promise.resolve(user);
            db.users.getByEmail = () => Promise.resolve(user);
        });

        describe("when credentials are invalid", () => {
            beforeEach(() => {
                let auth = proxyquire("../src/authentication", {
                    bcrypt: { compareSync: () => false },
                    "./db": db
                });

                auth.initialize(app);

                app.use("/sessions", routes);
            });

            it("should respond with a 401 unauthorized", (done) => {
                request(app)
                    .post("/sessions")
                    .type("json")
                    .send(JSON.stringify({
                        email: "sam@ifdown.net",
                        password: "invalid-password"
                    }))
                    .expect(401)
                    .end(done);
            });
        });

        describe("when credentials are valid", () => {
            beforeEach(() => {
                let auth = proxyquire("../src/authentication", {
                    bcrypt: { compareSync: () => true },
                    "./db": db
                });

                auth.initialize(app);

                app.use("/sessions", routes);
            });

            it("should set a session cookie", (done) => {
                request(app)
                    .post("/sessions")
                    .type("json")
                    .send(JSON.stringify({
                        email: "sam@ifdown.net",
                        password: "password"
                    }))
                    .expect("set-cookie", /[^ ]+/, done);
            });
        });
    });

    describe("GET /sessions", () => {
        beforeEach(() => {
            db.users.get = () => Promise.resolve(user);
            db.users.getByEmail = () => Promise.resolve(user);

            let auth = proxyquire("../src/authentication", {
                bcrypt: { compareSync: () => true },
                "./db": db
            });

            auth.initialize(app);

            app.use("/sessions", routes);
        });

        describe("when not logged in", () => {
            it("should render an empty object", (done) => {
                request(app)
                    .get("/sessions")
                    .expect(200)
                    .expect("Content-Type", /json/)
                    .expect({}, done);
            });
        });

        describe("when logged in", () => {
            it("should render the current user", (done) => {
                login().then(agent => {
                    agent
                        .get("/sessions")
                        .expect(200)
                        .expect("Content-Type", /json/)
                        .expect(res => {
                            let user = res.body;
                            expect(user.email).to.equal("sam@ifdown.net");
                        })
                        .end(done);
                    })
                    .catch(done);
            });
        });
    });
});


