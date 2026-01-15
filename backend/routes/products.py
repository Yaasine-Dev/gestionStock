from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Product, User, Category
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
    products = db.query(Product).all()
    result = []
    for product in products:
        product_dict = {
            "id": product.id,
            "name": product.name,
            "price": product.price,
            "quantity": product.quantity,
            "sku": product.sku,
            "description": product.description,
            "category_id": product.category_id,
            "supplier_id": product.supplier_id,
            "image_url": product.image_url,
            "category_name": None
        }
        if product.category_id:
            category = db.query(Category).filter(Category.id == product.category_id).first()
            if category:
                product_dict["category_name"] = category.name
        result.append(product_dict)
    return result

# POST create product
@router.post("/")
def create_product(product: ProductCreate, db: Session = Depends(get_db), user: User = Depends(role_dependency(["ADMIN", "MANAGER"]))):
    # only ADMIN or MANAGER can create products
    new_product = Product(
        name=product.name, 
        price=product.price, 
        quantity=product.quantity,
        sku=product.sku,
        description=product.description,
        category_id=product.category_id,
        supplier_id=product.supplier_id,
        image_url=product.image_url if hasattr(product, 'image_url') else None
    )
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
    
    if product_data.name is not None:
        db_product.name = product_data.name
    if product_data.price is not None:
        db_product.price = product_data.price
    if product_data.quantity is not None:
        db_product.quantity = product_data.quantity
    if product_data.sku is not None:
        db_product.sku = product_data.sku
    if product_data.description is not None:
        db_product.description = product_data.description
    if product_data.category_id is not None:
        db_product.category_id = product_data.category_id
    if product_data.supplier_id is not None:
        db_product.supplier_id = product_data.supplier_id
    if hasattr(product_data, 'image_url') and product_data.image_url is not None:
        db_product.image_url = product_data.image_url
        
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
    
    try:
        db.delete(product)
        db.commit()
        return {"detail": "Produit supprimé"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Impossible de supprimer ce produit car il est utilisé dans des commandes ou mouvements de stock")
