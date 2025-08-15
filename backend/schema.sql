-- Create companies table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    registration_no VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_role enum type first
CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'COMPANY_ADMIN', 'DRIVER', 'PASSENGER');

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    password_hash TEXT NOT NULL,
    phone_number VARCHAR(20),
    role user_role NOT NULL,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    refresh_token TEXT;
);

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- You already created: CREATE TYPE user_role AS ENUM ('SUPER_ADMIN','COMPANY_ADMIN','DRIVER','PASSENGER');

CREATE TYPE bus_status AS ENUM ('ACTIVE', 'INACTIVE', 'MAINTENANCE');
CREATE TYPE trip_status AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE hail_status AS ENUM ('PENDING', 'ASSIGNED', 'FULFILLED', 'CANCELLED');


CREATE TABLE IF NOT EXISTS terminals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(120) NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Helpful index for name search & geospatial-ish lookups
CREATE INDEX IF NOT EXISTS idx_terminals_name ON terminals (name);
CREATE INDEX IF NOT EXISTS idx_terminals_lat_lng ON terminals (latitude, longitude);


CREATE TABLE IF NOT EXISTS buses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    plate_number VARCHAR(20) NOT NULL UNIQUE,
    capacity INT NOT NULL CHECK (capacity > 0),
    driver_id INTEGER UNIQUE REFERENCES users(id) ON DELETE SET NULL, -- one bus ↔ one driver
    status bus_status NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_buses_company ON buses (company_id);


CREATE TABLE IF NOT EXISTS user_location_eta (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    eta_minutes INT,                       -- ETA in minutes from Gebeta Maps API
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(120), -- e.g., "Line 1: North → South"
    start_terminal_id UUID NOT NULL REFERENCES terminals(id),
    end_terminal_id UUID NOT NULL REFERENCES terminals(id),
    distance_km DECIMAL(6,2),              -- optional
    estimated_time INTERVAL,               -- optional
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS bus_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bus_id UUID NOT NULL REFERENCES buses(id) ON DELETE CASCADE,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,

    recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bus_locations_bus_time ON bus_locations (bus_id, recorded_at DESC);
