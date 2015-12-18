-- +migrate Up
CREATE TABLE trip_reports (
    id uuid DEFAULT gen_random_uuid(),
    canyon_id uuid REFERENCES canyons(id),
    user_id uuid REFERENCES users(id),
    date date,
    comments varchar(300),
    rating smallint,
    PRIMARY KEY (id)
);

-- +migrate Down
DROP TABLE trip_reports;

