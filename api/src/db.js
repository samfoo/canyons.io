import pgp from "pg-promise";

const CONNECTION_STRING = "pg://canyons:canyons@db:5432/canyons";

export default pgp()(CONNECTION_STRING);
