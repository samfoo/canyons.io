import { Users, Canyons, TripReports } from "../tables";

function isUUID(s) {
    let uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    return s.match(uuid);
}

export function getForCanyon(db, id) {
    let select = TripReports.select(TripReports.star(), Users.slug, Users.name),
        common = TripReports.join(Users).on(Users.id.equals(TripReports.user_id));

    if (isUUID(id)) {
        select = select
            .from(common)
            .where(TripReports.canyon_id.equals(id));
    } else {
        select = select
            .from(common.join(Canyons).on(Canyons.id.equals(TripReports.canyon_id)))
            .where(Canyons.slug.equals(id));
    }

    select = select.order(TripReports.date.descending);

    return db.query(select.toString());
}

export function createForUserAndCanyon(db, userId, canyonId, data) {
    let insert = TripReports
        .insert(
            TripReports.date.value(new Date(data.date)),
            TripReports.comments.value(data.comments || null),
            TripReports.rating.value(data.rating),
            TripReports.canyon_id.value(canyonId),
            TripReports.user_id.value(userId)
        ).returning("*").toString();

    return db.query(insert);
}
