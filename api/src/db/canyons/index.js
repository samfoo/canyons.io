import slug from "slug";
import * as model from "models/canyon";
import { Canyons } from "../tables";

function isUUID(s) {
    let uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    return s.match(uuid);
}

export const images = require("./images");
export const tripReports = require("./trip-reports");

export function create(db, data) {
    let insert = Canyons
        .insert(
            Canyons.name.value(data.name),
            Canyons.slug.value(slug(data.name, {lower: true})),
            Canyons.access.value(data.access),
            Canyons.notes.value(data.notes),
            Canyons.gps.value(JSON.stringify(data.gps))
        ).returning("*").toString();

    return db.query(insert)
        .then(canyons => {
            let canyon = canyons[0];
            return model.decorate(canyon);
        });
}

export function all(db) {
    let select = Canyons
        .select(Canyons.star())
        .from(Canyons)
        .limit(10)
        .toString();

    return db.query(select);
}

export function get(db, id) {
    let select = Canyons.select(Canyons.star())
                        .from(Canyons);

    if (isUUID(id)) {
        select = select.where(Canyons.id.equals(id));
    } else {
        select = select.where(Canyons.slug.equals(id));
    }

    return db.query(select.toString()).then(r => {
        if (r.length > 0) {
            let canyon = r[0];
            return model.decorate(canyon);
        } else {
            return null;
        }
    });
}

