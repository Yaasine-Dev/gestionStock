from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import StockMovement
from schemas import StockMovementCreate

router = APIRouter(prefix="/stock", tags=["Stock"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def list_movements(db: Session = Depends(get_db)):
    return db.query(StockMovement).all()

@router.post("/")
def create_movement(mv: StockMovementCreate, db: Session = Depends(get_db)):
    new_mv = StockMovement(product_id=mv.product_id, type=mv.type, quantity=mv.quantity)
    db.add(new_mv)
    db.commit()
    db.refresh(new_mv)
    return new_mv

@router.delete("/{movement_id}")
def delete_movement(movement_id: int, db: Session = Depends(get_db)):
    mv = db.query(StockMovement).filter(StockMovement.id == movement_id).first()
    if not mv:
        raise HTTPException(status_code=404, detail="Mouvement non trouvé")
    db.delete(mv)
    db.commit()
    return {"detail": "Mouvement supprimé"}
