#!/usr/bin/env python3

import pymysql
from sqlalchemy import create_engine, inspect

def check_database_structure():
    try:
        # Connect using SQLAlchemy
        DATABASE_URL = "mysql+pymysql://root:@localhost/stock_db"
        engine = create_engine(DATABASE_URL)
        inspector = inspect(engine)
        
        # Get all tables
        tables = inspector.get_table_names()
        print(f"Tables in database: {tables}")
        
        # Check products table structure
        if 'products' in tables:
            print("\n=== PRODUCTS TABLE ===")
            columns = inspector.get_columns('products')
            for column in columns:
                nullable = "NULL" if column['nullable'] else "NOT NULL"
                default = f" DEFAULT {column['default']}" if column['default'] is not None else ""
                print(f"  {column['name']}: {column['type']} {nullable}{default}")
        
        # Check other tables
        for table_name in ['users', 'categories', 'suppliers', 'orders', 'stock_movements']:
            if table_name in tables:
                print(f"\n=== {table_name.upper()} TABLE ===")
                columns = inspector.get_columns(table_name)
                for column in columns:
                    nullable = "NULL" if column['nullable'] else "NOT NULL"
                    print(f"  {column['name']}: {column['type']} {nullable}")
        
        # Test connection with raw PyMySQL
        print("\n=== TESTING CONNECTION ===")
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password='',
            database='stock_db'
        )
        
        with connection.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM products")
            count = cursor.fetchone()[0]
            print(f"Products count: {count}")
            
            if count > 0:
                cursor.execute("SELECT * FROM products LIMIT 3")
                products = cursor.fetchall()
                print("Sample products:")
                for product in products:
                    print(f"  {product}")
        
        connection.close()
        print("Database connection successful!")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_database_structure()