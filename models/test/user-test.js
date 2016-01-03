/* eslint-env node, mocha */

import Immutable from "immutable";
import { User } from "../src";
import { expect } from "chai";

describe("the user model", () => {
    describe("can", () => {
        describe("create-canyon", () => {
            it("should be true when user is non-null", () => {
                let loggedIn = Immutable.fromJS({email: "sam@ifdown.net"});

                expect(User.can(loggedIn, "create-canyon")).to.be.ok;
            });

            it("should be false when user is null", () => {
                expect(User.can(null, "create-canyon")).to.not.be.ok;
            });
        });
    });
});

