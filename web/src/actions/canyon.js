import request from "axios";
import api from "./api";

export function createCanyon(canyon) {
    return {
        type: "CREATE_CANYON",
        promise: request.post(api("canyons"), canyon.toJS())
    };
}

export function getCanyonImages(id) {
    return {
        type: "GET_CANYON_IMAGES",
        canyonId: id,
        promise: request.get(api(`canyons/${id}/images`))
    };
}

export function getCanyon(id) {
    return {
        type: "GET_CANYON",
        promise: request.get(api("canyons/" + id))
    };
}

export function getCanyons() {
    return {
        type: "GET_CANYONS",
        promise: request.get(api("canyons"))
    };
}

