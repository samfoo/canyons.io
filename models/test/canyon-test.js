/* eslint-env node, mocha */

import { Canyon } from "../lib";
import { markdown } from "markdown";
import { expect } from "chai";

describe("the canyon model", () => {
    const requiredFields = ["name", "access", "notes"];

    describe("decorate", () => {
        let access = "Super\n\ncool\n\naccess";
        let notes = "Super\n\ncool\n\nnotes";
        let decorated = Canyon.decorate({ notes, access });

        it("should add the key path `formatted.access` with access parsed as markdown", () => {
            expect(decorated.formatted.access).to.equal(markdown.toHTML(access));
        });

        it("should add the key path `formatted.notes` with notes parsed as markdown", () => {
            expect(decorated.formatted.notes).to.equal(markdown.toHTML(notes));
        });
    });

    describe("validate", () => {
        requiredFields.forEach((field) => {
            describe("when " + field + " is not present", () => {
                it("should contain a validation error for " + field, () => {
                    let c = {
                        name: "Starlight",
                        access: "Head to the wollangambe...",
                        notes: "Long walk in accross the river..."
                    };

                    delete c[field];

                    let results = Canyon.validate(c);
                    let errors = {};
                    errors[field] = ["is required"];

                    expect(results).to.deep.equal(errors);
                });
            });
        });
    });
});
