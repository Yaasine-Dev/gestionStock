from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User
from tools.hash_password import hash_password
from schemas import UserCreate, UserUpdate, UserOut
from dependencies import get_current_user, role_dependency
from typing import List
from fastapi import status

router = APIRouter(prefix="/users", tags=["Users"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/")
def create_user(user: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(role_dependency("ADMIN"))):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")
    hashed_pwd = hash_password(user.password)
    db_user = User(
        name=user.name,
        email=user.email,
        password=hashed_pwd,
        role=user.role,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.get("/", response_model=List[UserOut])
def list_users(db: Session = Depends(get_db), current_user: User = Depends(role_dependency(["ADMIN", "MANAGER"]))):
    users = db.query(User).all()
    return users


@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    # allow if requester is admin/manager or requesting own record
    if current_user.role not in ("ADMIN", "MANAGER") and current_user.id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès interdit")
    return target


@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(role_dependency("ADMIN"))):
    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    db.delete(target)
    db.commit()
    return {"detail": "Utilisateur supprimé"}


@router.put("/{user_id}")
def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    if user.password:
        db_user.password = hash_password(user.password)
    if user.name is not None:
        db_user.name = user.name
    if user.role is not None:
        db_user.role = user.role
    db.commit()
    db.refresh(db_user)
    return db_user
