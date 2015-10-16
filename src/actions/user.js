import request from 'axios';

const sessionsUri = "http://localhost:5678/sessions";

export function currentUser() {
    return {
        type: 'GET_CURRENT_USER',
        promise: request.get(sessionsUri)
    }
}
