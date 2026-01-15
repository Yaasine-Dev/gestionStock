-- Sample data for stock_db database
USE stock_db;

-- Insert Users (password for all: admin123)
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@stock.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'ADMIN'),
('Manager User', 'manager@stock.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'MANAGER'),
('Employee User', 'employee@stock.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'EMPLOYEE');

-- Insert Categories
INSERT INTO categories (name) VALUES 
('Électronique'),
('Vêtements'),
('Alimentation'),
('Meubles'),
('Livres');

-- Insert Suppliers
INSERT INTO suppliers (name, phone, email) VALUES 
('TechSupply Co', '0612345678', 'contact@techsupply.com'),
('Fashion World', '0623456789', 'info@fashionworld.com'),
('Food Distributors', '0634567890', 'sales@fooddist.com'),
('Furniture Plus', '0645678901', 'orders@furnitureplus.com');

-- Insert Products
INSERT INTO products (name, price, quantity, sku, description, category_id, supplier_id, image_url) VALUES 
('Laptop Dell XPS 13', 1299.99, 15, 'DELL-XPS13', 'Ordinateur portable haute performance', 1, 1, NULL),
('iPhone 14 Pro', 1199.99, 25, 'APPLE-IP14', 'Smartphone dernière génération', 1, 1, NULL),
('T-Shirt Nike', 29.99, 100, 'NIKE-TS01', 'T-shirt sport confortable', 2, 2, NULL),
('Jean Levis 501', 89.99, 50, 'LEVIS-501', 'Jean classique', 2, 2, NULL),
('Café Arabica 1kg', 15.99, 200, 'CAFE-AR1K', 'Café premium', 3, 3, NULL),
('Bureau en bois', 299.99, 10, 'DESK-W01', 'Bureau moderne en bois', 4, 4, NULL),
('Chaise ergonomique', 199.99, 20, 'CHAIR-E01', 'Chaise de bureau confortable', 4, 4, NULL),
('Python Programming', 45.99, 30, 'BOOK-PY01', 'Livre de programmation Python', 5, NULL, NULL);

-- Insert Orders
INSERT INTO orders (product_id, quantity, status, order_date) VALUES 
(1, 2, 'COMPLETED', '2025-01-15'),
(2, 5, 'COMPLETED', '2025-01-16'),
(3, 10, 'PENDING', '2025-01-20'),
(5, 50, 'COMPLETED', '2025-01-18'),
(6, 3, 'PENDING', '2025-01-21'),
(7, 5, 'CANCELLED', '2025-01-19');

-- Insert Stock Movements
INSERT INTO stock_movements (product_id, type, quantity, movement_date) VALUES 
(1, 'IN', 20, '2025-01-10 10:00:00'),
(1, 'OUT', 5, '2025-01-15 14:30:00'),
(2, 'IN', 30, '2025-01-12 09:00:00'),
(2, 'OUT', 5, '2025-01-16 11:00:00'),
(3, 'IN', 150, '2025-01-08 08:00:00'),
(3, 'OUT', 50, '2025-01-14 16:00:00'),
(5, 'IN', 300, '2025-01-05 07:00:00'),
(5, 'OUT', 100, '2025-01-18 13:00:00');
