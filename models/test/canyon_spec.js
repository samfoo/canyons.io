/* eslint-env node, mocha */

import * as canyon from "../canyon";
import { expect } from "chai";

describe("The canyon data model", () => {
    const requiredFields = ["name", "access", "notes"];

    requiredFields.forEach((field) => {
        describe("when " + field + " is not present", () => {
            it("should contain a validation error for " + field, () => {
                let c = {
                    name: "Starlight",
                    access: "Head to the wollangambe...",
                    notes: "Long walk in accross the river..."
                };

                delete c[field];

                let results = canyon.validate(c);
                let errors = {};
                errors[field] = ["is required"];

                expect(results).to.deep.equal(errors);
            });
        });
    });
});
