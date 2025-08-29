-- Create companies table (UPDATED WITH SUPERADMIN FIELDS)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    registration_no VARCHAR(50),
    address TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
    approved_by INTEGER REFERENCES users(id),
    approval_date TIMESTAMP,
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
    refresh_token TEXT
);

CREATE EXTENSION IF NOT EXISTS pgcrypto;

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
    driver_id INTEGER UNIQUE REFERENCES users(id) ON DELETE SET NULL,
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
    eta_minutes INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(120),
    start_terminal_id UUID NOT NULL REFERENCES terminals(id),
    end_terminal_id UUID NOT NULL REFERENCES terminals(id),
    distance_km DECIMAL(6,2),
    estimated_time INTERVAL,
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

-- ========================
-- Insert Data (UPDATED FOR SUPERADMIN)
-- ========================

-- Sample Terminals
INSERT INTO terminals (id, name, latitude, longitude) VALUES
(gen_random_uuid(), 'Bole', 9.009000, 38.761000),
(gen_random_uuid(), 'Piassa', 9.005000, 38.745000),
(gen_random_uuid(), 'Mexico', 9.013000, 38.750000),
(gen_random_uuid(), 'Tuludimtu', 9.020000, 38.765000),
(gen_random_uuid(), 'Megenagna', 9.025000, 38.780000);

-- Sample Companies (UPDATED WITH STATUS)
INSERT INTO companies (id, name, registration_no, address, status) VALUES
(gen_random_uuid(), 'BlueBus Co.', 'BB123', 'Addis Ababa', 'approved'),
(gen_random_uuid(), 'GreenLine Transport', 'GL456', 'Addis Ababa', 'approved'),
(gen_random_uuid(), 'Pending Transport Ltd.', 'PT789', 'Addis Ababa', 'pending');

-- Sample Users (UPDATED WITH SUPERADMIN)
INSERT INTO users (name, email, password_hash, phone_number, role, company_id) VALUES
('Transport Minister', 'superadmin@transport.gov.et', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+251911000000', 'SUPER_ADMIN', NULL),
('BlueBus Manager', 'manager@bluebus.com', 'hashed_pw', '+251911000001', 'COMPANY_ADMIN', (SELECT id FROM companies WHERE name='BlueBus Co.')),
('GreenLine Manager', 'manager@greenline.com', 'hashed_pw', '+251911000002', 'COMPANY_ADMIN', (SELECT id FROM companies WHERE name='GreenLine Transport')),
('Driver One', 'driver1@example.com', 'hashed_pw', '+251911000003', 'DRIVER', (SELECT id FROM companies WHERE name='BlueBus Co.')),
('Driver Two', 'driver2@example.com', 'hashed_pw', '+251911000004', 'DRIVER', (SELECT id FROM companies WHERE name='BlueBus Co.')),
('Driver Three', 'driver3@example.com', 'hashed_pw', '+251911000005', 'DRIVER', (SELECT id FROM companies WHERE name='GreenLine Transport'));

-- Update companies with approval info
UPDATE companies 
SET approved_by = (SELECT id FROM users WHERE email='superadmin@transport.gov.et'),
    approval_date = NOW()
WHERE status = 'approved';

-- Sample Buses
INSERT INTO buses (id, company_id, plate_number, capacity, driver_id, status) VALUES
(gen_random_uuid(), (SELECT id FROM companies WHERE name='BlueBus Co.'), 'BB-001', 50, (SELECT id FROM users WHERE email='driver1@example.com'), 'ACTIVE'),
(gen_random_uuid(), (SELECT id FROM companies WHERE name='BlueBus Co.'), 'BB-002', 40, (SELECT id FROM users WHERE email='driver2@example.com'), 'ACTIVE'),
(gen_random_uuid(), (SELECT id FROM companies WHERE name='GreenLine Transport'), 'GL-101', 60, (SELECT id FROM users WHERE email='driver3@example.com'), 'ACTIVE');

-- Sample Routes
INSERT INTO routes (id, company_id, name, start_terminal_id, end_terminal_id, distance_km, estimated_time) VALUES
(gen_random_uuid(), (SELECT id FROM companies WHERE name='BlueBus Co.'), 'Line 1: Bole → Piassa', 
 (SELECT id FROM terminals WHERE name='Bole'), 
 (SELECT id FROM terminals WHERE name='Piassa'), 5.2, '00:15:00'),
(gen_random_uuid(), (SELECT id FROM companies WHERE name='BlueBus Co.'), 'Line 2: Piassa → Mexico', 
 (SELECT id FROM terminals WHERE name='Piassa'), 
 (SELECT id FROM terminals WHERE name='Mexico'), 6.0, '00:18:00'),
(gen_random_uuid(), (SELECT id FROM companies WHERE name='GreenLine Transport'), 'Line 3: Tuludimtu → Megenagna', 
 (SELECT id FROM terminals WHERE name='Tuludimtu'), 
 (SELECT id FROM terminals WHERE name='Megenagna'), 7.5, '00:22:00');

-- Sample Bus Locations
INSERT INTO bus_locations (bus_id, latitude, longitude, recorded_at) VALUES
((SELECT id FROM buses WHERE plate_number='BB-001'), 9.010000, 38.762000, NOW()),
((SELECT id FROM buses WHERE plate_number='BB-002'), 9.006500, 38.746000, NOW()),
((SELECT id FROM buses WHERE plate_number='GL-101'), 9.021000, 38.776000, NOW());

-- Create analytics table for SuperAdmin dashboard
CREATE TABLE IF NOT EXISTS system_analytics (
    id SERIAL PRIMARY KEY,
    total_companies INTEGER DEFAULT 0,
    active_companies INTEGER DEFAULT 0,
    pending_companies INTEGER DEFAULT 0,
    total_buses INTEGER DEFAULT 0,
    active_buses INTEGER DEFAULT 0,
    total_drivers INTEGER DEFAULT 0,
    active_drivers INTEGER DEFAULT 0,
    total_passengers INTEGER DEFAULT 0,
    total_revenue DECIMAL(15,2) DEFAULT 0,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial analytics data
INSERT INTO system_analytics (total_companies, active_companies, pending_companies, total_buses, active_buses, total_drivers, active_drivers, total_passengers, total_revenue) VALUES
(3, 2, 1, 3, 3, 3, 3, 0, 0);