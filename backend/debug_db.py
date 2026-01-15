#!/usr/bin/env python3

from sqlalchemy import create_engine, inspect
from database import engine, SessionLocal
from models import Product, Category, Supplier, User

def debug_database():
    try:
        # Check if database file exists and is accessible
        print("=== Database Connection Test ===")
        
        # Test connection
        with engine.connect() as conn:
            print("[OK] Database connection successful")
        
        # Check tables
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"[OK] Tables found: {tables}")
        
        # Check products table specifically
        if 'products' in tables:
            columns = inspector.get_columns('products')
            print(f"[OK] Products table has {len(columns)} columns")
            
            # Query products
            db = SessionLocal()
            try:
                products = db.query(Product).all()
                print(f"[OK] Found {len(products)} products in database")
                
                if products:
                    print("\nFirst few products:")
                    for i, product in enumerate(products[:3]):
                        print(f"  {i+1}. ID: {product.id}, Name: {product.name}, Price: {product.price}")
                else:
                    print("[WARNING] No products found in database")
                    
            finally:
                db.close()
        else:
            print("[ERROR] Products table not found")
            
        # Check other tables
        for table_name, model in [('categories', Category), ('suppliers', Supplier), ('users', User)]:
            if table_name in tables:
                db = SessionLocal()
                try:
                    count = db.query(model).count()
                    print(f"[OK] {table_name}: {count} records")
                finally:
                    db.close()
        
    except Exception as e:
        print(f"[ERROR] Database error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug_database()