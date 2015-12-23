/* eslint-env node, mocha */

import Immutable from "immutable";
import { authorized } from "../../src/decorators";
import { expect } from "chai";

describe("the @authorize decorator", () => {
    let state;
    let store;

    beforeEach(() => {
        state = { users: Immutable.Map() };
        store = {
            getState: () => state
        };
    });

    describe("onEnter", () => {
        it("should call the parent's onEnter if one exists", done => {
            @authorized(() => false)
            class Parent {
                static onEnter = store => {
                    return (s, n, cb) => {
                        done();
                    };
                }
            }

            Parent.onEnter(store)({}, {}, e => {});
        });

        it("should call the predicate with the current user", done => {
            state.users = Immutable.fromJS({current: "current-user"});

            @authorized(user => {
                expect(user).to.equal(state.users.get("current"));
                done();
            })
            class NotAuthd {}

            NotAuthd.onEnter(store)({}, {}, e => {});
        });

        it("should callback successfully when predicate is true", done => {
            @authorized(() => true)
            class Authd {}

            Authd.onEnter(store)({}, {}, e => {
                expect(typeof e).to.equal("undefined");
                done();
            });
        });

        it("should callback with a 403 error when predicate is false", done => {
            @authorized(() => false)
            class NotAuthd {}

            NotAuthd.onEnter(store)({}, {}, e => {
                expect(e.status).to.equal(403);
                done();
            });
        });
    });
});
