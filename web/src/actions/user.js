export function getCurrentUser() {
    return {
        type: "GET_CURRENT_USER",
        promise: api => api.get("sessions")
    };
}

export function login(email, pass) {
    return {
        type: "LOGIN_USER",
        promise: api => api.post("sessions", {
            email: email,
            password: pass
        })
    };
}

export function register(email, pass, confirmation) {
    return {
        type: "REGISTER_USER",
        promise: api => api.post("users", {
            email: email,
            password: pass,
            confirmation: confirmation
        })
    };
}
