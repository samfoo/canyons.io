-- +migrate Up
CREATE TABLE users (id uuid, email text, password text);

-- +migrate Down
DROP TABLE users;
