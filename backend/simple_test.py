import sqlite3
import os

# Check if database exists
db_path = "stock_management.db"
if os.path.exists(db_path):
    print("Database file exists")
    
    # Connect and check tables
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Get all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print(f"Tables: {[table[0] for table in tables]}")
    
    # Check products count
    try:
        cursor.execute("SELECT COUNT(*) FROM products")
        products_count = cursor.fetchone()[0]
        print(f"Products count: {products_count}")
        
        # Show first few products
        cursor.execute("SELECT id, name, price FROM products LIMIT 5")
        products = cursor.fetchall()
        print(f"Sample products: {products}")
    except Exception as e:
        print(f"Products table error: {e}")
    
    # Check categories count
    try:
        cursor.execute("SELECT COUNT(*) FROM categories")
        categories_count = cursor.fetchone()[0]
        print(f"Categories count: {categories_count}")
        
        # Show categories
        cursor.execute("SELECT id, name FROM categories")
        categories = cursor.fetchall()
        print(f"Categories: {categories}")
    except Exception as e:
        print(f"Categories table error: {e}")
    
    # Check users count
    try:
        cursor.execute("SELECT COUNT(*) FROM users")
        users_count = cursor.fetchone()[0]
        print(f"Users count: {users_count}")
    except Exception as e:
        print(f"Users table error: {e}")
    
    conn.close()
else:
    print("Database file does not exist")