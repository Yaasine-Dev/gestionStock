#!/usr/bin/env python3
"""
Migration script to update orders table structure
"""
from sqlalchemy import create_engine, text
from database import DATABASE_URL

def migrate_orders_table():
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as conn:
        # Start transaction
        trans = conn.begin()
        
        try:
            # Drop existing orders table if it exists
            conn.execute(text("DROP TABLE IF EXISTS orders"))
            
            # Create new orders table with updated structure
            conn.execute(text("""
                CREATE TABLE orders (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    reference VARCHAR(50) NOT NULL UNIQUE,
                    supplier VARCHAR(100),
                    total FLOAT,
                    status VARCHAR(20) DEFAULT 'en_attente',
                    date DATE
                )
            """))
            
            # Insert some sample data
            conn.execute(text("""
                INSERT INTO orders (reference, supplier, total, status, date) VALUES
                ('CMD-001', 'Fournisseur A', 1250.50, 'en_attente', '2024-01-15'),
                ('CMD-002', 'Fournisseur B', 890.75, 'confirmee', '2024-01-14'),
                ('CMD-003', 'Fournisseur C', 2100.00, 'livree', '2024-01-13')
            """))
            
            trans.commit()
            print("Orders table migrated successfully!")
            
        except Exception as e:
            trans.rollback()
            print(f"Migration failed: {e}")
            raise

if __name__ == "__main__":
    migrate_orders_table()