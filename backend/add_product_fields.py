#!/usr/bin/env python3

import mysql.connector
from mysql.connector import Error

def add_product_fields():
    try:
        # Connect to MySQL database
        connection = mysql.connector.connect(
            host='localhost',
            database='stock_db',
            user='root',
            password=''  # Add your MySQL password if you have one
        )

        if connection.is_connected():
            cursor = connection.cursor()
            
            # Add sku column
            try:
                cursor.execute("ALTER TABLE products ADD COLUMN sku VARCHAR(100) NULL")
                print("✓ Added sku column")
            except Error as e:
                if "Duplicate column name" in str(e):
                    print("✓ sku column already exists")
                else:
                    print(f"Error adding sku column: {e}")
            
            # Add description column
            try:
                cursor.execute("ALTER TABLE products ADD COLUMN description VARCHAR(500) NULL")
                print("✓ Added description column")
            except Error as e:
                if "Duplicate column name" in str(e):
                    print("✓ description column already exists")
                else:
                    print(f"Error adding description column: {e}")
            
            connection.commit()
            print("✓ Database migration completed successfully!")

    except Error as e:
        print(f"Error connecting to MySQL: {e}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == "__main__":
    add_product_fields()