import request from "axios";
import api from "./api";

export function getCurrentUser() {
    return {
        type: "GET_CURRENT_USER",
        promise: request.get(api("sessions"))
    };
}

export function login(email, pass) {
    return {
        type: "LOGIN_USER",
        promise: request.post(api("sessions"), {
            email: email,
            password: pass
        })
    }
}
