import Immutable from "immutable";

const defaultState = new Immutable.Map();

export default function canyonReducer(state=defaultState, action) {
    switch (action.type) {
    case "CREATE_CANYON":
        state = state
            .remove("list")
            .setIn(["meta", "@@loaded/list"], false);
        // falls through
    case "GET_CANYON":
        return state
            .setIn(["ids", action.res.data.slug], Immutable.fromJS(action.res.data))
            .setIn(["ids", action.res.data.id], Immutable.fromJS(action.res.data))
            .setIn(["meta", `@@loaded/ids/${action.res.data.slug}`], true)
            .setIn(["meta", `@@loaded/ids/${action.res.data.id}`], true);
    case "GET_CANYONS":
        return state
            .set("list", Immutable.fromJS(action.res.data))
            .setIn(["meta", "@@loaded/list"], true);
    case "GET_CANYON_IMAGES":
        return state
            .setIn(["images", "ids", action.canyonId], Immutable.fromJS(action.res.data))
            .setIn(["meta", `@@loaded/images/ids/${action.canyonId}`], true);
    case "GET_CANYON_TRIP_REPORTS":
        return state
            .setIn(["trip-reports", "ids", action.canyonId], Immutable.fromJS(action.res.data))
            .setIn(["meta", `@@loaded/trip-reports/ids/${action.canyonId}`], true);
    default:
        return state;
    }
}

