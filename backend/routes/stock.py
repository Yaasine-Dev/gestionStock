from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Product, StockMovement
from schemas import StockAdjust, StockMovementCreate

router = APIRouter(prefix="/stock", tags=["Stock"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def list_movements(db: Session = Depends(get_db)):
    movements = (
        db.query(StockMovement)
        .join(Product, Product.id == StockMovement.product_id)
        .order_by(StockMovement.movement_date.desc())
        .all()
    )
    result = []
    for mv in movements:
        mv_type = mv.type.value if hasattr(mv.type, "value") else str(mv.type)
        result.append(
            {
                "id": mv.id,
                "product_id": mv.product_id,
                "product_name": mv.product.name if mv.product else None,
                "sku": getattr(mv.product, "sku", None) if mv.product else None,
                "type": mv_type,
                "quantity": mv.quantity,
                "movement_date": mv.movement_date,
            }
        )
    return result

@router.post("/")
def create_movement(mv: StockMovementCreate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == mv.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")

    if mv.type == "OUT":
        if product.quantity < mv.quantity:
            raise HTTPException(status_code=400, detail="Stock insuffisant")
        product.quantity -= mv.quantity
    else:
        product.quantity += mv.quantity

    new_mv = StockMovement(product_id=mv.product_id, type=mv.type, quantity=mv.quantity)
    db.add(new_mv)
    db.commit()
    db.refresh(new_mv)
    db.refresh(product)
    return {
        "movement": new_mv,
        "product": product,
    }

@router.get("/product/{product_id}")
def list_movements_by_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")

    movements = (
        db.query(StockMovement)
        .filter(StockMovement.product_id == product_id)
        .order_by(StockMovement.movement_date.desc())
        .all()
    )
    result = []
    for mv in movements:
        mv_type = mv.type.value if hasattr(mv.type, "value") else str(mv.type)
        result.append(
            {
                "id": mv.id,
                "product_id": mv.product_id,
                "product_name": product.name,
                "sku": product.sku,
                "type": mv_type,
                "quantity": mv.quantity,
                "movement_date": mv.movement_date,
            }
        )
    return result

@router.put("/{movement_id}")
def update_movement(movement_id: int, mv: StockMovementCreate, db: Session = Depends(get_db)):
    existing = db.query(StockMovement).filter(StockMovement.id == movement_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Mouvement non trouvé")

    if existing.product_id != mv.product_id:
        raise HTTPException(status_code=400, detail="Modification du produit non supportée")
    existing_type = existing.type.value if hasattr(existing.type, "value") else str(existing.type)
    if existing_type != mv.type:
        raise HTTPException(status_code=400, detail="Modification du type non supportée")

    diff = mv.quantity - existing.quantity
    if diff == 0:
        return existing

    product = db.query(Product).filter(Product.id == existing.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")

    if mv.type == "OUT":
        if diff > 0 and product.quantity < diff:
            raise HTTPException(status_code=400, detail="Stock insuffisant")
        product.quantity -= diff
    else:
        product.quantity += diff

    existing.quantity = mv.quantity
    db.commit()
    db.refresh(existing)
    db.refresh(product)
    return {
        "movement": existing,
        "product": product,
    }

@router.post("/add")
def add_stock(payload: StockAdjust, db: Session = Depends(get_db)):
    if payload.movement_type != "IN":
        raise HTTPException(status_code=400, detail="movement_type doit être IN")
    if payload.quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantité invalide")

    product = db.query(Product).filter(Product.id == payload.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")

    product.quantity += payload.quantity
    mv = StockMovement(product_id=payload.product_id, type="IN", quantity=payload.quantity)
    db.add(mv)
    db.commit()
    db.refresh(mv)
    db.refresh(product)
    return {
        "movement": mv,
        "product": product,
    }

@router.post("/remove")
def remove_stock(payload: StockAdjust, db: Session = Depends(get_db)):
    if payload.movement_type != "OUT":
        raise HTTPException(status_code=400, detail="movement_type doit être OUT")
    if payload.quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantité invalide")

    product = db.query(Product).filter(Product.id == payload.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    if product.quantity < payload.quantity:
        raise HTTPException(status_code=400, detail="Stock insuffisant")

    product.quantity -= payload.quantity
    mv = StockMovement(product_id=payload.product_id, type="OUT", quantity=payload.quantity)
    db.add(mv)
    db.commit()
    db.refresh(mv)
    db.refresh(product)
    return {
        "movement": mv,
        "product": product,
    }

@router.delete("/{movement_id}")
def delete_movement(movement_id: int, db: Session = Depends(get_db)):
    mv = db.query(StockMovement).filter(StockMovement.id == movement_id).first()
    if not mv:
        raise HTTPException(status_code=404, detail="Mouvement non trouvé")

    product = db.query(Product).filter(Product.id == mv.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")

    if mv.type == "OUT":
        product.quantity += mv.quantity
    else:
        product.quantity -= mv.quantity

    db.delete(mv)
    db.commit()
    return {"detail": "Mouvement supprimé"}
