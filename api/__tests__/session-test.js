/* eslint-env node, jest */

jest.dontMock("../src/session");
jest.dontMock("../src/authentication");

import bodyParser from "body-parser";
import express from "express";
import request from "supertest";
import db from "../src/db";
import bcrypt from "bcrypt";

const auth = require("../src/authentication");
const session = require("../src/session");

describe("sessions", () => {
    let app;

    let login = () => {
        let agent = request.agent(app);

        bcrypt.compareSync.mockReturnValue(true);

        return new Promise((resolve, reject) => {
            agent
                .post("/sessions")
                .type("json")
                .send(JSON.stringify({
                    email: "sam@ifdown.net",
                    password: "password"
                }))
                .expect(200)
                .end((err) => {
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
        auth.initialize(app);
        app.use("/sessions", session.routes);
    });

    describe("POST /sessions/logout", () => {
        beforeEach(() => {
            db.one.mockReturnValue(
                Promise.resolve({
                    id: "user-id",
                    email: "sam@ifdown.net",
                    password: "crypted-password"
                })
            );

            bcrypt.compareSync.mockReturnValue(false);
        });

        pit("should delete session", () => {
            return login().then(agent => {
                return new Promise((resolve, reject) => {
                    agent
                        .post("/sessions/logout")
                        .type("json")
                        .expect(200)
                        .end(() => {
                            agent
                                .get("/sessions")
                                .expect(200)
                                .expect({}, err => {
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

    describe("POST /sessions", () => {
        beforeEach(() => {
            db.one.mockReturnValue(
                Promise.resolve({
                    id: "user-id",
                    email: "sam@ifdown.net",
                    password: "crypted-password"
                })
            );
        });

        describe("when credentials are invalid", () => {
            beforeEach(() => {
                bcrypt.compareSync.mockReturnValue(false);
            });

            pit("should respond with a 401 unauthorized", () => {
                return new Promise((resolve, reject) => {
                    request(app)
                        .post("/sessions")
                        .type("json")
                        .send(JSON.stringify({
                            email: "sam@ifdown.net",
                            password: "password"
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

        describe("when credentials are valid", () => {
            beforeEach(() => {
                bcrypt.compareSync.mockReturnValue(true);
            });

            pit("should set a session cookie", () => {
                return new Promise((resolve, reject) => {
                    request(app)
                        .post("/sessions")
                        .type("json")
                        .send(JSON.stringify({
                            email: "sam@ifdown.net",
                            password: "password"
                        }))
                        .expect("set-cookie", /[^ ]+/, err => {
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

    describe("GET /sessions", () => {
        describe("when not logged in", () => {
            pit("should render an empty object", () => {
                return new Promise((resolve, reject) => {
                    request(app)
                        .get("/sessions")
                        .expect(200)
                        .expect("Content-Type", /json/)
                        .expect({}, err => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                });
            });
        });

        describe("when logged in", () => {
            beforeEach(() => {
                db.one.mockReturnValue(
                    Promise.resolve({
                        id: "user-id",
                        email: "sam@ifdown.net",
                        password: "crypted-password"
                    })
                );
            });

            pit("should render the current user", () => {
                return login().then(agent => {
                    return new Promise((resolve, reject) => {
                        agent
                            .get("/sessions")
                            .expect(200)
                            .expect("Content-Type", /json/)
                            .expect(res => {
                                let user = res.body;
                                expect(user.email).toEqual("sam@ifdown.net");
                            })
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
});

