
-- db/schema.sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS species (
  id SERIAL PRIMARY KEY,
  common_name TEXT NOT NULL,
  scientific_name TEXT,
  label_key TEXT UNIQUE,            -- mapping to ML label if needed
  notes TEXT
);

CREATE TABLE IF NOT EXISTS catches (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  species_id INTEGER REFERENCES species(id),
  image_path TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  caught_at TIMESTAMP DEFAULT NOW(),
  weather JSONB,
  score REAL
);

CREATE TABLE IF NOT EXISTS rec_cache (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE,             -- hash of lat,lon,date or similar
  payload JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
