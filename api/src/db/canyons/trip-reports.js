import { TripReports } from "../tables";

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
