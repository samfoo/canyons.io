/* eslint-env node, jest, jasmine */

jest.dontMock("../../../src/components/canyons/new");
jest.dontMock("../../../src/components/forms");

import Immutable from "immutable";
import React from "react";
import TestUtils from "react-addons-test-utils";
import * as model from "models/canyon";
import * as CanyonActions from "../../../src/actions/canyon";

const NewCanyon = require("../../../src/components/canyons/new");

const newCanyon = (props) => {
    return React.createElement(NewCanyon, props);
};

describe("the new canyon form", () => {
    let store;
    let form;
    let history;

    beforeEach(() => {
        history = {
            pushState: jest.genMockFn()
        };

        store = {
            subscribe: () => {},
            dispatch: jest.genMockFn(),
            getState: jest.genMockFn()
        };

        store.getState.mockReturnValue({});

        form = TestUtils.renderIntoDocument(newCanyon({store: store, history: history}));
    });

    describe("when submitting a valid form", () => {
        beforeEach(() => {
            model.validate.mockReturnValue({});
        });

        it("should dispatch a 'createCanyon' action with the state of the form fields", () => {
            let canyon = Immutable.fromJS({name: "Arethusa", notes: "Really fun...", access: "Bell's line..."});
            canyon.forEach((v, k) => {
                let input = TestUtils.findRenderedDOMComponentWithClass(form, `${k}-input`);
                TestUtils.Simulate.change(input, {target: {value: v}});
            });

            CanyonActions.createCanyon.mockReturnValue("create-canyon-action");
            store.dispatch.mockReturnValue(Promise.resolve({id: "canyon-id"}));

            let submit = TestUtils.findRenderedDOMComponentWithTag(form, "button");
            TestUtils.Simulate.click(submit);

            expect(CanyonActions.createCanyon.mock.calls[0].map(c => c.toJS())).toEqual([canyon.toJS()]);
            expect(store.dispatch).toBeCalledWith("create-canyon-action");
        });

        it("should redirect to the newly created canyon", () => {
            store.dispatch.mockReturnValue(Promise.resolve({id: "canyon-id"}));

            let submit = TestUtils.findRenderedDOMComponentWithTag(form, "button");
            TestUtils.Simulate.click(submit);

            waitsFor(() => {
                return history.pushState.mock.calls.length > 0;
            }, "The URL should have been updated", 100);

            runs(() => {
                expect(history.pushState).toBeCalledWith({}, "/canyons/canyon-id");
            });
        });
    });

    describe("when submitting an invalid form", () => {
        beforeEach(() => {
            model.validate.mockReturnValue({
                name: ["is required"]
            });
        });

        it("should display an error on the invalid field", () => {
            let submit = TestUtils.findRenderedDOMComponentWithTag(form, "button");
            TestUtils.Simulate.click(submit);

            let error = TestUtils.findRenderedDOMComponentWithClass(form, "name-error");

            expect(error.textContent).toEqual("is required");
        });

        it("should not dispatch a 'createCanyon' action", () => {
            let submit = TestUtils.findRenderedDOMComponentWithTag(form, "button");
            TestUtils.Simulate.click(submit);

            expect(store.dispatch).not.toBeCalled();
        });
    });
});
