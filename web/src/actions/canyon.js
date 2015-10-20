import request from "axios";

const canyonsUri = "http://localhost:5678/canyons";

export function createCanyon(canyon) {
    return {
        type: "CREATE_CANYON",
        promise: request.post(canyonsUri, canyon.toJS())
    };
}

