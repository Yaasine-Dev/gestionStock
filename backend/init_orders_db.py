from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, Order, OrderStatus
from datetime import date, timedelta

# Create all tables
Base.metadata.create_all(bind=engine)

# Create sample orders
db = SessionLocal()
try:
    # Clear existing orders
    db.query(Order).delete()
    
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
    print("Database tables created and sample orders added successfully!")
        
finally:
    db.close()