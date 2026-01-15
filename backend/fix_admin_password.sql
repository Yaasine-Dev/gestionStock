-- Update admin password to use SHA-256 hash
-- Password: admin123
UPDATE users 
SET password = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9' 
WHERE email = 'admin@stock.com';
