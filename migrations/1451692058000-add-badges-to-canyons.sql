-- +migrate Up
ALTER TABLE canyons ADD COLUMN badges jsonb;

-- +migrate Down
ALTER TABLE canyons DROP COLUMN badges;


