from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import SessionLocal
from models import Category, Product
from schemas import CategoryCreate, CategoryUpdate

router = APIRouter(prefix="/categories", tags=["Categories"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def list_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    result = []
    for cat in categories:
        products = db.query(Product).filter(Product.category_id == cat.id).all()
        total_products = len(products)
        total_quantity = sum(p.quantity for p in products)
        total_value = sum(p.price * p.quantity for p in products)
        result.append({
            "id": cat.id,
            "name": cat.name,
            "total_products": total_products,
            "total_quantity": total_quantity,
            "total_value": total_value
        })
    return result

@router.post("/")
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    new_cat = Category(name=category.name)
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return new_cat

@router.put("/{category_id}")
def update_category(category_id: int, category: CategoryUpdate, db: Session = Depends(get_db)):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Catégorie non trouvée")
    if category.name:
        cat.name = category.name
    db.commit()
    db.refresh(cat)
    return cat

@router.delete("/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Catégorie non trouvée")
    db.delete(cat)
    db.commit()
    return {"detail": "Catégorie supprimée"}
