from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import SessionLocal
from models import Product, Category, Order

router = APIRouter(prefix="/stats", tags=["Stats"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_stats(db: Session = Depends(get_db)):
    # Get all products for value calculation
    all_products = db.query(Product).all()
    
    # Products count per category (including categories with zero products)
    prod_by_cat_q = (
        db.query(Category.name, func.count(Product.id))
        .outerjoin(Product, Product.category_id == Category.id)
        .group_by(Category.id)
        .all()
    )
    
    # Calculate value per category
    products_by_category = []
    for name, count in prod_by_cat_q:
        category_products = [p for p in all_products if p.category_id and db.query(Category).filter(Category.id == p.category_id).first().name == name]
        value = sum((p.price or 0) * (p.quantity or 0) for p in category_products)
        products_by_category.append({
            "category": name,
            "count": int(count),
            "value": float(value)
        })

    # Total stock (sum of quantities)
    total_stock = db.query(func.sum(Product.quantity)).scalar() or 0
    try:
        total_stock = int(total_stock)
    except Exception:
        total_stock = 0
    
    # Total stock value
    stock_value = sum((p.price or 0) * (p.quantity or 0) for p in all_products)

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
        "stock_value": float(stock_value),
        "orders_by_status": orders_by_status,
    }
