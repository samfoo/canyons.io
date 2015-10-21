import request from "axios";
import api from "./api";

export function createCanyon(canyon) {
    return {
        type: "CREATE_CANYON",
        promise: request.post(api("canyons"), canyon.toJS())
    };
}

