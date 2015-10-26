import request from "axios";
import api from "./api";

export function createCanyon(canyon) {
    return {
        type: "CREATE_CANYON",
        promise: request.post(api("canyons"), canyon.toJS())
    };
}

export function getCanyon(params) {
    return {
        type: "GET_CANYON",
        promise: request.get(api("canyons/" + params.id))
    };
}

export function getCanyons() {
    return {
        type: "GET_CANYONS",
        promise: request.get(api("canyons"))
    };
}

