-- +migrate Up
CREATE TABLE canyon_images (
    id uuid DEFAULT gen_random_uuid(),
    canyon_id uuid REFERENCES canyons(id),
    cloudinary_response jsonb,
    PRIMARY KEY (id)
);

-- +migrate Down
DROP TABLE canyon_images;

