import slug from "slug";
import bcrypt from "bcrypt";
import { Users } from "./tables";

export function create(db, data) {
    let salt = bcrypt.genSaltSync(10),
        crypted = bcrypt.hashSync(data.password, salt);

    let insert = Users.insert(
        Users.email.value(data.email),
        Users.name.value(data.name),
        Users.slug.value(slug(data.name, {lower: true})),
        Users.password.value(crypted)
    ).returning("*").toString();

    return db.one(insert);
}

export function get(db, id) {
    let select = Users.select(Users.star())
                      .from(Users)
                      .where(Users.id.equals(id))
                      .toString();

    return db.one(select);
}

export function getByEmail(db, email) {
    let select = Users.select(Users.star())
                      .from(Users)
                      .where(Users.email.equals(email))
                      .toString();

    return db.one(select);
}
