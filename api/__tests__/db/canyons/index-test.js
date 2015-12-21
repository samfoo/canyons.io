/* eslint-env node, jest */

jest.dontMock("../../../src/db/canyons");
jest.dontMock("../../../src/db/tables");

import model from "models/canyon";

const canyons = require("../../../src/db/canyons");

describe("canyons database", () => {
    let db = {
        connection: {
            query: jest.genMockFn()
        }
    };

    describe("create", () => {
        let canyon = {
            name: "Claustral",
            access: "Walk to the Blue Mountains...",
            notes: "The keyhole abseil is sketchy...",
            gps: {}
        };

        pit("should decorate the first result", () => {
            db.connection.query.mockReturnValue(Promise.resolve([canyon]));

            return canyons
                .create(db.connection, canyon)
                .then(() => {
                    expect(model.decorate).toBeCalledWith(canyon);
                });
        });
    });

    describe("get", () => {
        let canyon = "mock-canyon";

        pit("should decorate the first result", () => {
            db.connection.query.mockReturnValue(Promise.resolve([canyon]));

            return canyons
                .get(db.connection, "mock-slug")
                .then(() => {
                    expect(model.decorate).toBeCalledWith(canyon);
                });
        });
    });
});
