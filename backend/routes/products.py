from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Product, User
from dependencies import role_dependency
from schemas import ProductCreate, ProductUpdate

router = APIRouter(prefix="/products", tags=["Products"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# GET all products
@router.get("/")
def list_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

# POST create product
@router.post("/")
def create_product(product: ProductCreate, db: Session = Depends(get_db), user: User = Depends(role_dependency(["ADMIN", "MANAGER"]))):
    # only ADMIN or MANAGER can create products
    new_product = Product(name=product.name, price=product.price, quantity=product.quantity)
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

# PUT update product
@router.put("/{product_id}")
def update_product(product_id: int, product_data: ProductUpdate, db: Session = Depends(get_db), user: User = Depends(role_dependency(["ADMIN", "MANAGER"]))):
    # only ADMIN or MANAGER can update products
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    if product_data.name:
        db_product.name = product_data.name
    if product_data.price is not None:
        db_product.price = product_data.price
    if product_data.quantity is not None:
        db_product.quantity = product_data.quantity
    db.commit()
    db.refresh(db_product)
    return db_product

# DELETE product
@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), user: User = Depends(role_dependency("ADMIN"))):
    # only ADMIN can delete products
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    db.delete(product)
    db.commit()
    return {"detail": "Produit supprimé"}
