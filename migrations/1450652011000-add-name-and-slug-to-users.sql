-- +migrate Up
ALTER TABLE users ADD COLUMN slug text;
ALTER TABLE users ADD UNIQUE(slug);
ALTER TABLE users ADD COLUMN name text;

-- +migrate Down
ALTER TABLE users DROP COLUMN slug;
ALTER TABLE users DROP COLUMN name;

