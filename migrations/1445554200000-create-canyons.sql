-- +migrate Up
CREATE TABLE canyons (id uuid, name text, access text, track_notes text);

-- +migrate Down
DROP TABLE canyons;
