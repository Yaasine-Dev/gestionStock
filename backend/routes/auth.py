from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User
from tools.hash_password import hash_password

router = APIRouter(prefix="/auth", tags=["Auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_password(plain_password, hashed_password):
    return hash_password(plain_password) == hashed_password

# mot de passe en clair
# def verify_password(plain_password, stored_password):
#     return plain_password == stored_password


@router.get("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Email ou mot de passe invalide")
    return {"user_id": user.id, "role": user.role}
