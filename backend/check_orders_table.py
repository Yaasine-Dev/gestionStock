from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, Order, OrderStatus, Product
from datetime import date, timedelta
import sqlalchemy as sa

# Check existing table structure
inspector = sa.inspect(engine)
if 'orders' in inspector.get_table_names():
    columns = inspector.get_columns('orders')
    print("Existing orders table columns:")
    for col in columns:
        print(f"  {col['name']}: {col['type']}")
else:
    print("Orders table does not exist")

# Create sample orders using existing structure
db = SessionLocal()
try:
    # Check existing orders
    existing = db.query(Order).all()
    print(f"\nExisting orders: {len(existing)}")
    
    if len(existing) == 0:
        # Create orders using the original model structure
        sample_orders = [
            Order(
                product_id=1,  # Assuming product with ID 1 exists
                quantity=10,
                status="PENDING",
                order_date=date.today()
            ),
            Order(
                product_id=1,
                quantity=5,
                status="COMPLETED", 
                order_date=date.today() - timedelta(days=2)
            ),
            Order(
                product_id=1,
                quantity=15,
                status="CANCELLED",
                order_date=date.today() - timedelta(days=5)
            )
        ]
        
        for order in sample_orders:
            db.add(order)
        
        db.commit()
        print("Sample orders created successfully!")
    else:
        print("Orders already exist")
        
finally:
    db.close()