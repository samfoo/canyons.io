import * as canyons from "./canyons";
import * as users from "./users";
import pgp from "pg-promise";

const CONNECTION_STRING = "pg://canyons:canyons@db:5432/canyons";

const connection = pgp()(CONNECTION_STRING);

export default { connection, canyons, users };
