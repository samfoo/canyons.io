import { CanyonImages, Canyons } from "../tables";

function isUUID(s) {
    let uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    return s.match(uuid);
}

export function createForCanyon(db, id, data) {
    let insert = CanyonImages
        .insert(
            CanyonImages.canyon_id.value(id),
            CanyonImages.cloudinary_response.value(JSON.stringify(data))
        ).returning("*").toString();

    return db.query(insert);
}

export function getForCanyon(db, id) {
    let select = CanyonImages.select(CanyonImages.cloudinary_response);

    if (isUUID(id)) {
        select = select
            .from(CanyonImages)
            .where(CanyonImages.canyon_id.equals(id));
    } else {
        select = select
            .from(CanyonImages.join(Canyons).on(Canyons.id.equals(CanyonImages.canyon_id)))
            .where(Canyons.slug.equals(id));
    }

    return db.query(select.toString());
}
