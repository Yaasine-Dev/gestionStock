#!/usr/bin/env python3
"""
Migration script to add image_url column to products table
"""

import sqlite3
import os

def add_image_column():
    # Get the database path
    db_path = os.path.join(os.path.dirname(__file__), 'stock_management.db')
    
    try:
        # Connect to the database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if column already exists
        cursor.execute("PRAGMA table_info(products)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'image_url' not in columns:
            # Add the image_url column
            cursor.execute("ALTER TABLE products ADD COLUMN image_url TEXT")
            conn.commit()
            print("✅ Successfully added image_url column to products table")
        else:
            print("ℹ️  image_url column already exists in products table")
            
    except sqlite3.Error as e:
        print(f"❌ Database error: {e}")
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    add_image_column()