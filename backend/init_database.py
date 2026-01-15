#!/usr/bin/env python3
"""
Script to initialize the database with tables and sample data
"""
from database import engine
from models import Base, User, Category, Product, Supplier
from sqlalchemy.orm import sessionmaker
import hashlib

def create_tables():
    """Create all tables"""
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully")

def add_sample_data():
    """Add sample data to the database"""
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    
    try:
        # Check if data already exists
        if db.query(User).first():
            print("📋 Sample data already exists")
            return
        
        # Create sample categories
        categories = [
            Category(name="Électronique"),
            Category(name="Mobilier"),
            Category(name="Fournitures"),
        ]
        db.add_all(categories)
        db.commit()
        
        # Create sample suppliers
        suppliers = [
            Supplier(name="TechCorp", email="contact@techcorp.com", phone="0123456789"),
            Supplier(name="OfficeSupply", email="info@officesupply.com", phone="0987654321"),
        ]
        db.add_all(suppliers)
        db.commit()
        
        # Create sample products
        products = [
            Product(name="Ordinateur Portable", price=899.99, quantity=10, category_id=1, supplier_id=1),
            Product(name="Souris Sans Fil", price=29.99, quantity=50, category_id=1, supplier_id=1),
            Product(name="Bureau Ergonomique", price=299.99, quantity=5, category_id=2, supplier_id=2),
            Product(name="Stylos (Pack de 10)", price=9.99, quantity=100, category_id=3, supplier_id=2),
        ]
        db.add_all(products)
        db.commit()
        
        # Create admin user
        admin_password = hashlib.sha256("admin123".encode()).hexdigest()
        admin_user = User(
            name="Administrateur",
            email="admin@stock.com",
            password=admin_password,
            role="ADMIN"
        )
        db.add(admin_user)
        db.commit()
        
        print("✅ Sample data added successfully")
        print("👤 Admin user created: admin@stock.com / admin123")
        
    except Exception as e:
        print(f"❌ Error adding sample data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Initializing database...")
    create_tables()
    add_sample_data()
    print("✅ Database initialization complete!")