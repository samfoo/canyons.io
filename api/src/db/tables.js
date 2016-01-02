import sql from "sql";

export const Canyons = sql.define({
    name: "canyons",
    columns: ["id", "name", "slug", "access", "notes", "gps", "badges"]
});

export const CanyonImages = sql.define({
    name: "canyon_images",
    columns: ["id", "canyon_id", "cloudinary_response"]
});

export const Users = sql.define({
    name: "users",
    columns: ["id", "email", "name", "slug", "password"]
});

export const TripReports = sql.define({
    name: "trip_reports",
    columns: ["id", "date", "comments", "rating", "canyon_id", "user_id"]
});

