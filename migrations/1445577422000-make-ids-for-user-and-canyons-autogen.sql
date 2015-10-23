-- +migrate Up
CREATE EXTENSION pgcrypto SCHEMA public;

UPDATE canyons SET id=gen_random_uuid() WHERE id is null;
UPDATE users SET id=gen_random_uuid() WHERE id is null;

ALTER TABLE canyons ADD PRIMARY KEY (id);
ALTER TABLE canyons ALTER COLUMN id SET DEFAULT gen_random_uuid();

ALTER TABLE users ADD PRIMARY KEY (id);
ALTER TABLE users ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- +migrate Down
DROP EXTENSION pgcrypto;

ALTER TABLE canyons DROP PRIMARY KEY id;
ALTER TABLE canyons DROP DEFAULT;

ALTER TABLE users DROP PRIMARY KEY id;
ALTER TABLE users DROP DEFAULT;
