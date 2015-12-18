import bcrypt from "bcrypt";
import { Users } from "./tables";

export function create(db, data) {
    let salt = bcrypt.genSaltSync(10),
        crypted = bcrypt.hashSync(data.password, salt);

    let insert = Users.insert(
        Users.email.value(data.email),
        Users.password.value(crypted)
    ).returning("*").toString();

    return db.query(insert)
        .then(users => {
            return users[0];
        });
}

export function get(db, id) {
    let select = Users.select(Users.star())
                      .from(Users)
                      .where(Users.id.equals(id))
                      .toString();

    return db.one(select);
}

export function getByEmail(db, email) {
    let select = Users.select(Users.id, Users.email, Users.password)
                      .from(Users)
                      .where(Users.email.equals(email))
                      .toString();

    return db.one(select);
}
