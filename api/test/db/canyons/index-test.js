/* eslint-env node, mocha */

import * as canyons from "../../../src/db/canyons";
import sinon from "sinon";
import { Canyon } from "models";

const chai = require("chai");
const expect = chai.expect;
chai.use(require("sinon-chai"));

describe("canyons", () => {
    let db = { connection: { } };

    let canyon = {
        name: "Claustral",
        access: "Walk to the Blue Mountains...",
        notes: "The keyhole abseil is sketchy...",
        gps: {}
    };

    beforeEach(() => {
        db.connection.query = () => Promise.resolve([canyon]);
    });

    describe("create", () => {
        it("should decorate the first result", (done) => {
            canyons
                .create(db.connection, canyon)
                .then(model => {
                    expect(model).to.deep.equal(Canyon.decorate(canyon));
                    done();
                })
                .catch(done);
        });
    });

    describe("get", () => {
        it("should decorate the first result", (done) => {
            canyons
                .get(db.connection, "mock-slug")
                .then(model => {
                    expect(model).to.deep.equal(Canyon.decorate(canyon));
                    done();
                })
                .catch(done);
        });
    });
});

