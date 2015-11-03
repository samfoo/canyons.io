export function createCanyon(canyon) {
    return {
        type: "CREATE_CANYON",
        promise: api => api.post("canyons", canyon.toJS())
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

