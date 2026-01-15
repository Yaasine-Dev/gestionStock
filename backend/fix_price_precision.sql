-- Fix price precision for better currency handling
-- Change FLOAT to DECIMAL(10,2) for accurate currency calculations

USE stock_db;

-- Alter products table to use DECIMAL for price
ALTER TABLE products MODIFY COLUMN price DECIMAL(10,2) NOT NULL;

-- This ensures:
-- - 10 total digits (8 before decimal, 2 after)
-- - Accurate currency calculations without floating point errors
-- - Proper storage for Moroccan Dirham (DH) values
