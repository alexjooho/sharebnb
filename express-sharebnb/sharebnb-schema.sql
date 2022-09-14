CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1)
);

CREATE TABLE properties (
  name VARCHAR(25) PRIMARY KEY,
  address TEXT UNIQUE NOT NULL,
  image_url TEXT NOT NULL,
  owner VARCHAR(25) NOT NULL
    REFERENCES users ON DELETE CASCADE,
  price INTEGER NOT NULL
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  date_booked TIMESTAMP NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  booker VARCHAR(25) NOT NULL
    REFERENCES users ON DELETE CASCADE,
  property_name VARCHAR(25)
    REFERENCES properties ON DELETE CASCADE
);