import Immutable from "immutable";

const defaultState = new Immutable.Map();

export default function canyonReducer(state=defaultState, action) {
    console.log("REDUCING CANYONS!!!!", action.type);
    switch (action.type) {
    case "CREATE_CANYON":
        return state.set(action.res.data.id, Immutable.fromJS(action.res.data));
    case "GET_CANYON":
        return state.set(action.res.data.id, Immutable.fromJS(action.res.data));
    case "GET_CANYONS":
        return state
            .set("list", Immutable.fromJS(action.res.data))
            .set("@@server/list", true);
    default:
        return state;
    }
}

