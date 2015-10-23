-- +migrate Up
ALTER TABLE canyons RENAME COLUMN track_notes TO notes;

-- +migrate Down
ALTER TABLE canyons RENAME COLUMN notes TO track_notes;

