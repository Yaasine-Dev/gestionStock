#!/usr/bin/env python3

import sqlite3
import os

def add_product_fields():
    db_path = "./stock_management.db"
    
    if not os.path.exists(db_path):
        print(f"Database file {db_path} not found!")
        return
    
    try:
        # Connect to SQLite database
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()
        
        # Check current table structure
        cursor.execute("PRAGMA table_info(products)")
        columns = [column[1] for column in cursor.fetchall()]
        print(f"Current columns: {columns}")
        
        # Add sku column if it doesn't exist
        if 'sku' not in columns:
            cursor.execute("ALTER TABLE products ADD COLUMN sku VARCHAR(100)")
            print("✓ Added sku column")
        else:
            print("✓ sku column already exists")
        
        # Add description column if it doesn't exist
        if 'description' not in columns:
            cursor.execute("ALTER TABLE products ADD COLUMN description VARCHAR(500)")
            print("✓ Added description column")
        else:
            print("✓ description column already exists")
        
        connection.commit()
        print("✓ Database migration completed successfully!")
        
        # Show updated table structure
        cursor.execute("PRAGMA table_info(products)")
        columns = cursor.fetchall()
        print("\nUpdated table structure:")
        for column in columns:
            print(f"  {column[1]} ({column[2]})")

    except sqlite3.Error as e:
        print(f"SQLite error: {e}")
    finally:
        if connection:
            connection.close()

if __name__ == "__main__":
    add_product_fields()