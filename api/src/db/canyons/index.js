import slug from "slug";
import { Canyon as model } from "models";
import { Canyons } from "../tables";

function isUUID(s) {
    let uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    return s.match(uuid);
}

export const images = require("./images");
export const tripReports = require("./trip-reports");

export function update(db, id, data) {
    let updates = {
        access: data.access,
        notes: data.notes,
        gps: JSON.stringify(data.gps),
        badges: JSON.stringify(data.badges)
    };

    let update = Canyons
        .update(updates);

    if (isUUID(id)) {
        update = update.where(Canyons.id.equals(id));
    } else {
        update = update.where(Canyons.slug.equals(id));
    }


    return db.query(update.returning("*").toString())
        .then(canyons => {
            let canyon = canyons[0];
            return model.decorate(canyon);
        });
}

export function create(db, data) {
    let insert = Canyons
        .insert(
            Canyons.name.value(data.name),
            Canyons.slug.value(slug(data.name, {lower: true})),
            Canyons.access.value(data.access),
            Canyons.notes.value(data.notes),
            Canyons.gps.value(JSON.stringify(data.gps)),
            Canyons.badges.value(JSON.stringify(data.badges || []))
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

