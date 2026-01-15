-- Add user_id to stock_movements table to track who made the movement
USE stock_db;

ALTER TABLE stock_movements 
ADD COLUMN user_id INT NULL AFTER product_id,
ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
