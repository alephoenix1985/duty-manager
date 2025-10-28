-- SQL script for initializing the PostgreSQL database for the Duty App.
-- 
-- This script provides all the necessary commands to set up the database
-- from scratch. A user testing the application should run these commands
-- in their PostgreSQL client (like psql or pgAdmin).

-- ====================================================================
-- Step 1: Create the database
-- ====================================================================
-- Run this command from your terminal or execute it in a query tool connected
-- to your default PostgreSQL instance (you might need to be a superuser).
-- Note: If the database already exists, this command will fail. You can
-- safely ignore the error or drop the existing database first.

-- psql -U postgres -c "CREATE DATABASE duties"

-- After creating the database, you must connect to it before running the next steps.
-- In psql, you would do this: \c duties

-- ====================================================================
-- Step 2: Create the 'duties' table
-- ====================================================================
-- This table will store the to-do items.

DROP TABLE IF EXISTS duties;

CREATE TABLE duties (
    -- UUIDs are 36 characters long (including hyphens).
    id VARCHAR(36) PRIMARY KEY,
    
    -- The name or description of the duty.
    name VARCHAR(255) NOT NULL
);

-- ====================================================================
-- Step 3: Grant privileges to the application user
-- ====================================================================
-- The application connects using the 'postgres' user by default.
-- This command ensures the user has the necessary permissions for the table.

GRANT ALL PRIVILEGES ON TABLE duties TO postgres;

-- ====================================================================
-- Step 4 (Optional): Insert sample data for testing
-- ====================================================================
-- This allows the frontend to have some data to display immediately.

INSERT INTO duties (id, name) VALUES
('f8a9b2c1-3e4d-5f6a-7b8c-9d0e1f2a3b4c', 'Complete the technical test'),
('a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6', 'Prepare for the presentation'),
('12345678-90ab-cdef-1234-567890abcdef', 'Buy groceries');

-- ====================================================================
-- Setup is complete. The backend should now be able to connect and 
-- interact with the 'duties' table.
-- ====================================================================
