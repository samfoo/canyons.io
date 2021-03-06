export function createTripReport(canyonId, tripReport) {
    return {
        type: "CREATE_CANYON_TRIP_REPORT",
        canyonId: canyonId,
        promise: api => api.post(`canyons/${canyonId}/trip-reports`, tripReport.toJS())
    };
}

export function updateCanyon(id, canyon) {
    return {
        type: "UPDATE_CANYON",
        promise: api => api.post(`canyons/${id}`, canyon.toJS())
    };
}

export function createCanyon(canyon) {
    return {
        type: "CREATE_CANYON",
        promise: api => api.post("canyons", canyon.toJS())
    };
}

export function getCanyonTripReports(id) {
    return {
        type: "GET_CANYON_TRIP_REPORTS",
        canyonId: id,
        promise: api => api.get(`canyons/${id}/trip-reports`)
    };
}

export function getCanyonImages(id) {
    return {
        type: "GET_CANYON_IMAGES",
        canyonId: id,
        promise: api => api.get(`canyons/${id}/images`)
    };
}

export function getCanyon(id) {
    return {
        type: "GET_CANYON",
        promise: api => api.get("canyons/" + id)
    };
}

export function getCanyons() {
    return {
        type: "GET_CANYONS",
        promise: api => api.get("canyons")
    };
}

