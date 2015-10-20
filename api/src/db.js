import pgp from 'pg-promise';

const CONNECTION_STRING = "pg://canyons:canyons@localhost:5432/canyons";

export default pgp()(CONNECTION_STRING);
