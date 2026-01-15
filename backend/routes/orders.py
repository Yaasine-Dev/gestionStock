from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Order, Product
from datetime import date
from schemas import OrderCreate, OrderUpdate

router = APIRouter(prefix="/orders", tags=["Orders"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def list_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).join(Product).all()
    result = []
    for order in orders:
        result.append({
            "id": order.id,
            "product_id": order.product_id,
            "product_name": order.product.name if order.product else "Produit inconnu",
            "quantity": order.quantity,
            "status": order.status,
            "order_date": order.order_date
        })
    return result

@router.post("/")
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    # Verify product exists
    product = db.query(Product).filter(Product.id == order.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    
    new_order = Order(
        product_id=order.product_id,
        quantity=order.quantity,
        status=order.status,
        order_date=date.today()
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return new_order

@router.put("/{order_id}")
def update_order(order_id: int, order: OrderUpdate, db: Session = Depends(get_db)):
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Commande non trouvée")
    
    if order.product_id is not None:
        product = db.query(Product).filter(Product.id == order.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Produit non trouvé")
        db_order.product_id = order.product_id
    if order.quantity is not None:
        db_order.quantity = order.quantity
    if order.status is not None:
        db_order.status = order.status
    
    db.commit()
    db.refresh(db_order)
    return db_order

@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Commande non trouvée")
    db.delete(order)
    db.commit()
    return {"detail": "Commande supprimée"}