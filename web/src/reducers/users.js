import Immutable from "immutable";

const defaultState = new Immutable.Map();

export default function userReducer(state=defaultState, action) {
    switch (action.type) {
    case "GET_CURRENT_USER":
        return state
            .set("current", Immutable.fromJS(action.res.data))
            .setIn(["meta", "@@loaded/current"], true);
    case "LOGIN_USER":
        return state
            .set("current", Immutable.fromJS(action.res.data))
            .setIn(["meta", "@@loaded/current"], true);
    default:
        return state;
    }
}
