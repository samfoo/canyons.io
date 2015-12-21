/* eslint-env node, mocha */

import * as CanyonActions from "../../../src/actions/canyon";
import Immutable from "immutable";
import React from "react";
import TestUtils from "react-addons-test-utils";
import sinon from "sinon";
import { Canyon } from "models";

var d = React.DOM;

const proxyquire = require("proxyquire").noCallThru().noPreserveCache();
const chai = require("chai");
const expect = chai.expect;
chai.use(require("sinon-chai"));

class GpsUploader extends React.Component {
    render() {
        return d.div({}, "gps-uploader");
    }
}

let { NewCanyon } = proxyquire("../../../src/components/canyons/new", {
    "./gps-uploader": { GpsUploader: GpsUploader }
});

const newCanyon = (props) => {
    return React.createElement(NewCanyon, props);
};

describe("the new canyon form", () => {
    let store;
    let form;
    let history;

    beforeEach(() => {
        history = {
            pushState: sinon.stub()
        };

        store = {
            subscribe: () => {},
            dispatch: sinon.stub(),
            getState: () => {
                return {};
            }
        };
    });

    describe("when submitting a valid form", () => {
        beforeEach(() => {
            form = TestUtils.renderIntoDocument(newCanyon({store, history}));

            let canyon = Immutable.fromJS({name: "Arethusa", notes: "Really fun...", access: "Bell's line..."});
            canyon.forEach((v, k) => {
                let input = TestUtils.findRenderedDOMComponentWithClass(form, `${k}-input`);
                TestUtils.Simulate.change(input, {target: {value: v}});
            });

        });

        it("should dispatch a 'createCanyon' action with the state of the form fields", (done) => {
            store.dispatch.returns(Promise.resolve({id: "canyon-id", slug: "canyon-slug"}));

            let submit = TestUtils.findRenderedDOMComponentWithTag(form, "button");
            TestUtils.Simulate.click(submit);

            setImmediate(() => {
                expect(store.dispatch).to.have.been.calledWithMatch(sinon.match({
                    type: "CREATE_CANYON"
                }));

                done()
            });
        });

        it("should redirect to the newly created canyon", (done) => {
            store.dispatch.returns(Promise.resolve({id: "canyon-id", slug: "canyon-slug"}));

            let submit = TestUtils.findRenderedDOMComponentWithTag(form, "button");
            TestUtils.Simulate.click(submit);

            setImmediate(() => {
                expect(history.pushState).to.have.been.calledWith({}, "/canyons/canyon-slug");
                done()
            });
        });
    });

    describe("when submitting an invalid form", () => {
        beforeEach(() => {
            form = TestUtils.renderIntoDocument(newCanyon({store, history}));
        });

        it("should display an error on the invalid field", () => {
            let submit = TestUtils.findRenderedDOMComponentWithTag(form, "button");
            TestUtils.Simulate.click(submit);

            let error = TestUtils.findRenderedDOMComponentWithClass(form, "name-error");

            expect(error.textContent).to.equal("is required");
        });

        it("should not dispatch a 'createCanyon' action", () => {
            let submit = TestUtils.findRenderedDOMComponentWithTag(form, "button");
            TestUtils.Simulate.click(submit);

            expect(store.dispatch).not.to.have.been.called;
        });
    });
});

