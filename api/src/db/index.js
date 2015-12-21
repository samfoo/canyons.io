import pgp from "pg-promise";

const CONNECTION_STRING = "pg://canyons:canyons@db:5432/canyons";

export const connection = pgp()(CONNECTION_STRING);

export const canyons = require("./canyons");
export const users = require("./users");

