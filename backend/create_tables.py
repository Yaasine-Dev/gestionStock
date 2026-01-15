#!/usr/bin/env python3

from sqlalchemy import create_engine
from models import Base
from database import engine

def create_tables():
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("All tables created successfully!")
        
        # Verify tables were created
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"Created tables: {tables}")
        
        # Show products table structure
        if 'products' in tables:
            columns = inspector.get_columns('products')
            print("\nProducts table structure:")
            for column in columns:
                print(f"  {column['name']} ({column['type']})")
        
    except Exception as e:
        print(f"Error creating tables: {e}")

if __name__ == "__main__":
    create_tables()