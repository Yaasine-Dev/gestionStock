from sqlalchemy.orm import Session
from database import SessionLocal
from models import Order, OrderStatus
from datetime import date, timedelta

# Create sample orders
db = SessionLocal()
try:
    # Check if orders already exist
    existing_orders = db.query(Order).count()
    if existing_orders == 0:
        sample_orders = [
            Order(
                reference="CMD-001",
                supplier="Fournisseur Alpha",
                total=1250.75,
                status=OrderStatus.EN_ATTENTE,
                date=date.today()
            ),
            Order(
                reference="CMD-002", 
                supplier="Fournisseur Beta",
                total=890.50,
                status=OrderStatus.CONFIRMEE,
                date=date.today() - timedelta(days=2)
            ),
            Order(
                reference="CMD-003",
                supplier="Fournisseur Gamma", 
                total=2100.00,
                status=OrderStatus.LIVREE,
                date=date.today() - timedelta(days=5)
            ),
            Order(
                reference="CMD-004",
                supplier="Fournisseur Delta",
                total=450.25,
                status=OrderStatus.ANNULEE,
                date=date.today() - timedelta(days=1)
            )
        ]
        
        for order in sample_orders:
            db.add(order)
        
        db.commit()
        print("Sample orders created successfully!")
    else:
        print(f"{existing_orders} orders already exist in database")
        
finally:
    db.close()