from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Supplier
from schemas import SupplierCreate, SupplierUpdate

router = APIRouter(prefix="/suppliers", tags=["Suppliers"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def list_suppliers(db: Session = Depends(get_db)):
    return db.query(Supplier).all()

@router.post("/")
def create_supplier(supplier: SupplierCreate, db: Session = Depends(get_db)):
    new_sup = Supplier(name=supplier.name, phone=supplier.phone, email=supplier.email)
    db.add(new_sup)
    db.commit()
    db.refresh(new_sup)
    return new_sup

@router.put("/{supplier_id}")
def update_supplier(supplier_id: int, supplier: SupplierUpdate, db: Session = Depends(get_db)):
    sup = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not sup:
        raise HTTPException(status_code=404, detail="Fournisseur non trouvé")
    if supplier.name:
        sup.name = supplier.name
    if supplier.phone is not None:
        sup.phone = supplier.phone
    if supplier.email is not None:
        sup.email = supplier.email
    db.commit()
    db.refresh(sup)
    return sup

@router.delete("/{supplier_id}")
def delete_supplier(supplier_id: int, db: Session = Depends(get_db)):
    sup = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not sup:
        raise HTTPException(status_code=404, detail="Fournisseur non trouvé")
    db.delete(sup)
    db.commit()
    return {"detail": "Fournisseur supprimé"}
