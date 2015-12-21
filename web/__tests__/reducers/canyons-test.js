/* eslint-env node, jest */

jest.dontMock("../../src/reducers/canyons");

import Immutable from "immutable";

var reducer = require("../../src/reducers/canyons").reducer;

describe("the canyon reducer", () => {
    describe("CREATE_CANYON", () => {
        it("should set the created canyon in the store", () => {
            let canyon = { id: "created-canyon" };
            let createCanyon = { type: "CREATE_CANYON", res: { data: canyon }};

            let newState = reducer(Immutable.Map(), createCanyon);

            expect(newState.getIn(["ids", "created-canyon"])).toEqual(
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

            expect(newState.getIn(["meta", "@@loaded/list"])).toBeFalsy();
        });
    });
});
