/* eslint-env node, mocha */

import mockery from "mockery";
import bodyParser from "body-parser";
import express from "express";
import request from "supertest";
import session from "../src/session";
import mocks from "sinon";
import { expect } from "chai";

describe("sessions", () => {
    let app;

    let db = {
        one: () => Promise.reject()
    };

    let scrypt = {
        verifyKdf: () => Promise.reject()
    };

    let login = () => {
        let agent = request.agent(app);

        return new Promise(resolve => {
            agent
                .post("/sessions")
                .type("json")
                .send(JSON.stringify({
                    email: "sam@ifdown.net",
                    password: "password"
                }))
                .expect(200)
                .end(() => resolve(agent));
        });
    };

    before(() => {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });

        mockery.registerMock("./db", db);
        mockery.registerMock("scrypt", scrypt);

        let authentication = require("../src/authentication");

        app = express();
        app.use(bodyParser.json({limit: "3mb"}));
        authentication.initialize(app);
        app.use("/sessions", session.routes);
    });

    after(() => {
        mockery.disable();
    });

    describe("POST /sessions/logout", () => {
        beforeEach(() => {
            mocks.stub(db, "one", () => {
                return Promise.resolve({
                    id: "user-id",
                    email: "sam@ifdown.net",
                    password: "crypted-password"
                });
            });

            mocks.stub(scrypt, "verifyKdf", () => {
                return Promise.resolve(true);
            });
        });

        afterEach(() => {
            db.one.restore();
            scrypt.verifyKdf.restore();
        });

        it("should delete session", (done) => {
            login().then(agent => {
                agent
                    .post("/sessions/logout")
                    .type("json")
                    .expect(200)
                    .end(() => {
                        agent
                            .get("/sessions")
                            .expect(200)
                            .expect({}, done);
                    });
            });
        });
    });

    describe("POST /sessions", () => {
        beforeEach(() => {
            mocks.stub(db, "one", () => {
                return Promise.resolve({
                    id: "user-id",
                    email: "sam@ifdown.net",
                    password: "crypted-password"
                });
            });
        });

        afterEach(() => {
            db.one.restore();
        });

        describe("when credentials are invalid", () => {
            beforeEach(() => {
                mocks.stub(scrypt, "verifyKdf", () => {
                    return Promise.resolve(false);
                });
            });

            afterEach(() => {
                scrypt.verifyKdf.restore();
            });

            it("should respond with a 401 unauthorized", (done) => {
                request(app)
                    .post("/sessions")
                    .type("json")
                    .send(JSON.stringify({
                        email: "sam@ifdown.net",
                        password: "password"
                    }))
                    .expect(401)
                    .end(done);
            });
        });

        describe("when credentials are valid", () => {
            beforeEach(() => {
                mocks.stub(scrypt, "verifyKdf", () => {
                    return Promise.resolve(true);
                });
            });

            afterEach(() => {
                scrypt.verifyKdf.restore();
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
            beforeEach(() => {
                mocks.stub(db, "one", () => {
                    return Promise.resolve({
                        id: "user-id",
                        email: "sam@ifdown.net",
                        password: "crypted-password"
                    });
                });

                mocks.stub(scrypt, "verifyKdf", () => {
                    return Promise.resolve(true);
                });
            });

            afterEach(() => {
                db.one.restore();
                scrypt.verifyKdf.restore();
            });

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
                });
            });
        });
    });
});
