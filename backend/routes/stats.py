from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import SessionLocal
from models import Product, Category, Order

router = APIRouter(prefix="/api", tags=["API"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    # Products count per category (including categories with zero products)
    prod_by_cat_q = (
        db.query(Category.name, func.count(Product.id))
        .outerjoin(Product, Product.category_id == Category.id)
        .group_by(Category.id)
        .all()
    )
    products_by_category = [
        {"category": name, "count": int(count)} for name, count in prod_by_cat_q
    ]

    # Total stock (sum of quantities)
    total_stock = db.query(func.sum(Product.quantity)).scalar() or 0
    try:
        total_stock = int(total_stock)
    except Exception:
        total_stock = 0

    # Orders count by status
    orders_by_status_q = (
        db.query(Order.status, func.count(Order.id))
        .group_by(Order.status)
        .all()
    )
    orders_by_status = {str(status): int(count) for status, count in orders_by_status_q}

    return {
        "products_by_category": products_by_category,
        "total_stock": total_stock,
        "orders_by_status": orders_by_status,
    }
