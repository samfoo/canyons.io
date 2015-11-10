-- +migrate Up
ALTER TABLE canyons ADD COLUMN gps jsonb;

-- +migrate Down
ALTER TABLE canyons DROP COLUMN gps;

