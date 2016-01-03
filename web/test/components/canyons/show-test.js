/* eslint-env node, mocha */

import Immutable from "immutable";
import React from "react";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import sinon from "sinon";

const chai = require("chai");
const expect = chai.expect;
chai.use(require("sinon-chai"));

const { ShowCanyon } = require("../../../src/components/canyons/show");

const showCanyon = (props) => {
    return React.createElement(ShowCanyon, props);
};

describe("the canyon show page", () => {
    let canyon = Immutable.fromJS({
        slug: "arethusa",
        name: "Arethusa",
        notes: "Really fun...",
        access: "Bell's line...",
        badges: ["wetsuit"],
        formatted: {
            notes: "<p>Really fun...</p>",
            access: "<p>Bell's line...</p>"
        }
    });

    let image = Immutable.fromJS({
        secure_url: "https://example.com/cat-picture"
    });

    let users = Immutable.Map();

    let canyons = Immutable.fromJS({
        ids: { arethusa: canyon },
        images: { ids: { arethusa: [image] } },
        "trip-reports": { ids: { arethusa: [] } }
    });

    let state = {};

    let store = {
        subscribe: () => {},
        dispatch: sinon.stub(),
        getState: () => state
    };

    beforeEach(() => {
        state = {};
    });

    it("should display the canyon's formatted access details", () => {
        state = { users, canyons };

        let rendered = TestUtils.renderIntoDocument(
            showCanyon({ store: store, params: { id: "arethusa" } })
        );

        let node = ReactDOM.findDOMNode(rendered);
        let access = node.getElementsByClassName("access")[0];

        expect(access.textContent).to.equal(canyon.get("access"));
    });

    it("should display the canyon's formatted notes", () => {
        state = { users, canyons };

        let rendered = TestUtils.renderIntoDocument(
            showCanyon({ store: store, params: { id: "arethusa" } })
        );

        let node = ReactDOM.findDOMNode(rendered);
        let notes = node.getElementsByClassName("notes")[0];

        expect(notes.textContent).to.equal(canyon.get("notes"));
    });

    describe("when there are badges", () => {
        it("should display the badges", () => {
            state = { users, canyons };

            let rendered = TestUtils.renderIntoDocument(
                showCanyon({ store: store, params: { id: "arethusa" } })
            );

            let node = ReactDOM.findDOMNode(rendered);
            let badges = node.getElementsByClassName("badges")[0];

            expect(badges.getElementsByClassName("badge").length).to.equal(1);

            expect(
                badges.getElementsByTagName("li")[0].textContent
            ).to.equal("Wetsuit Required");
        });
    });

    describe("when there are trip reports", () => {
        it("should display the trip reports", () => {
            state = {
                users: users,
                canyons: canyons.updateIn(["trip-reports", "ids", "arethusa"], () => {
                    return Immutable.fromJS([
                        {
                            date: "2015-12-21T02:33:04.902Z",
                            comments: null,
                            slug: "samfoo",
                            name: "samfoo"
                        }
                    ]);
                })
            };

            let rendered = TestUtils.renderIntoDocument(
                showCanyon({ store: store, params: { id: "arethusa" } })
            );

            let node = ReactDOM.findDOMNode(rendered);
            let tripReports = node.getElementsByClassName("activity")[0];

            expect(
                tripReports.getElementsByClassName("trip-report").length
            ).to.equal(1);

            let date = tripReports.getElementsByClassName("date")[0];
            expect(date.textContent).to.equal("2015-12-21");

            expect(tripReports.textContent).to.equal(
                "2015-12-21 samfoo descended. "
            );
        });
    });
});

