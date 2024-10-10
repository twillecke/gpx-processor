CREATE DATABASE trail_runners;

\c trail_runners;

CREATE TABLE users (
    user_id UUID PRIMARY KEY,
    email_address VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL
);