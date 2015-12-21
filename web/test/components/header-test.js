/* eslint-env node, mocha */

import Immutable from "immutable";
import React from "react";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import { Header } from "../../src/components/header";
import { expect } from "chai";

const header = (props) => {
    return React.createElement(Header, props);
};

describe("the site header", () => {
    let state = {};

    let store = {
        subscribe: () => {},
        dispatch: () => {},
        getState: () => state
    };

    beforeEach(() => {
        state = {};
    });

    describe("when not logged in", () => {
        it("should display login and signup links", () => {
            state.users = Immutable.fromJS({});

            let rendered = TestUtils.renderIntoDocument(
                header({store: store})
            );

            let node = ReactDOM.findDOMNode(rendered);

            let signUp = node.getElementsByClassName("sign-up")[0];
            let login = node.getElementsByClassName("login")[0];

            expect(signUp.href).to.equal("/sign-up");
            expect(login.href).to.equal("/login");
        });
    });

    describe("when logged in", () => {
        it("should display user's email", () => {
            state.users = Immutable.fromJS({
                current: {
                    id: "user-id",
                    email: "user@example.com"
                }
            });

            let rendered = TestUtils.renderIntoDocument(
                header({store: store})
            );

            let node = ReactDOM.findDOMNode(rendered);
            let email = node.getElementsByClassName("logged-in-user")[0].textContent;

            expect(email).to.equal(state.users.getIn(["current", "email"]));
        });
    });
});

