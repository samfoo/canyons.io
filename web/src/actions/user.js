import request from "axios";
import api from "./api";

export function getCurrentUser() {
    return {
        type: "GET_CURRENT_USER",
        promise: request.get(api("sessions"))
    };
}
