/* eslint-env node, mocha */

import Immutable from "immutable";
import { reducer } from "../../src/reducers/canyons";
import { expect } from "chai";

describe("the canyon reducer", () => {
    describe("CREATE_CANYON", () => {
        it("should set the created canyon in the store", () => {
            let canyon = { id: "created-canyon" };
            let createCanyon = { type: "CREATE_CANYON", res: { data: canyon }};

            let newState = reducer(Immutable.Map(), createCanyon);

            expect(newState.getIn(["ids", "created-canyon"])).to.deep.equal(
                Immutable.fromJS(canyon)
            );
        });

        it("should set in the store that the canyon list hasn't been loaded", () => {
            let withListLoaded = Immutable.fromJS({
                list: [],
                meta: {
                    "@@loaded/list": true
                }
            });

            let createCanyon = {
                type: "CREATE_CANYON",
                res: { data: { id: "created-canyon" } }
            };

            let newState = reducer(withListLoaded, createCanyon);

            expect(newState.getIn(["meta", "@@loaded/list"])).to.not.be.ok;
        });
    });
});

