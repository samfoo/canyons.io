import simplify from "simplify-js";
import Immutable from "immutable";

export function compressFeature(feature) {
    if (!feature.geometry) {
        return feature;
    }

    switch (feature.geometry.type) {
        case "LineString":
            let original = feature.geometry.coordinates;
            let normalised = original.map(c => {
                return {x: c[0], y: c[1]}
            });

            let compressed = simplify(normalised, 0.00025, false);

            feature.geometry.coordinates = compressed.map((c, i) => {
                return [
                    c.x,
                    c.y,
                    original[i][2] // don't lose the original elevation data
                ];
            })

            return feature;
        default:
            return feature;
    }
};

export function compress(data) {
    if (typeof data.features !== "undefined") {
        data.features = data.features.map(compressFeature);
    }

    return data;
}
