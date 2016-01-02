/* eslint-env node, mocha */

import { Canyon } from "../src";
import { markdown } from "markdown";
import { expect } from "chai";

describe("the canyon model", () => {
    const requiredFields = ["name", "access", "notes"];
    const badges = ["wetsuit", "cold", "swim", "abseil", "rope"];

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
        it("should be valid when badges is empty", () => {
            let c = {
                name: "Starlight",
                access: "Head to the wollangambe...",
                notes: "Long walk in accross the river...",
                badges: []
            };

            let errors = Canyon.validate(c);
            expect(errors).to.be.empty;
        });

        it("should be invalid when badges contains an unknown badge", () => {
            let c = {
                name: "Starlight",
                access: "Head to the wollangambe...",
                notes: "Long walk in accross the river...",
                badges: ["not-valid-badge"]
            };

            let errors = Canyon.validate(c);
            expect(errors).to.not.be.empty;

            let expected = {
                "badges.0.badges": [ 'must be present in given enumerator' ]
            };

            expect(errors).to.deep.equal(expected);
        });

        badges.forEach(badge => {
            describe("when badges contains '" + badge + "'", () => {
                it("should be valid", () => {
                    let c = {
                        name: "Starlight",
                        access: "Head to the wollangambe...",
                        notes: "Long walk in accross the river...",
                        badges: [badge]
                    };

                    let errors = Canyon.validate(c);
                    expect(errors).to.be.empty;
                });
            });
        });

        requiredFields.forEach(field => {
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
