-- Check current products in database
USE stock_db;

-- Show all products
SELECT * FROM products;

-- Show product count
SELECT COUNT(*) as total_products FROM products;

-- Show products with categories
SELECT 
    p.id,
    p.name,
    p.price,
    p.quantity,
    p.sku,
    c.name as category_name,
    s.name as supplier_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN suppliers s ON p.supplier_id = s.id;
