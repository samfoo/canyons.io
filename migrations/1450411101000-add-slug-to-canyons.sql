-- +migrate Up
ALTER TABLE canyons ADD COLUMN slug text;
ALTER TABLE canyons ADD UNIQUE(slug);

-- +migrate Down
ALTER TABLE canyons DROP COLUMN slug;


