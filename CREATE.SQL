CREATE DATABASE trail_runners;

\c trail_runners;

CREATE TABLE users (
    user_id UUID PRIMARY KEY,
    email_address VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL
);

CREATE TABLE trail_metadata (
    track_id UUID PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    title VARCHAR(255) NOT NULL,
    author_id UUID NOT NULL,
    image_url VARCHAR(255),
    location VARCHAR(255) NOT NULL,
    total_distance NUMERIC NOT NULL,
    elevation_gain NUMERIC NOT NULL
);

CREATE TABLE trail_data (
    track_id UUID PRIMARY KEY,
    track_info JSONB NOT NULL,
    FOREIGN KEY (track_id) REFERENCES trail_metadata(track_id) ON DELETE CASCADE
);
