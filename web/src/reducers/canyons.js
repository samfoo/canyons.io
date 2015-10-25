import Immutable from "immutable";

const defaultState = new Immutable.Map();

export default function canyonReducer(state=defaultState, action) {
    switch (action.type) {
    case "CREATE_CANYON":
        return state.set(action.res.data.id, Immutable.fromJS(action.res.data));
    case "GET_CANYON":
        return state.set(action.res.data.id, Immutable.fromJS(action.res.data));
    default:
        return state;
    }
}

