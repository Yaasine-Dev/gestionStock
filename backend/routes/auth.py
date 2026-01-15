from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from pydantic import BaseModel
from database import SessionLocal
from models import User
from tools.hash_password import hash_password

router = APIRouter(prefix="/auth", tags=["Auth"])

class LoginRequest(BaseModel):
    email: str
    password: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_password(plain_password, hashed_password):
    return hash_password(plain_password) == hashed_password

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.email == request.email).first()
        if not user or not verify_password(request.password, user.password):
            raise HTTPException(status_code=401, detail="Email ou mot de passe invalide")
        
        # Handle role serialization
        role_value = user.role.value if hasattr(user.role, 'value') else str(user.role)
        
        return {
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": role_value
            }
        }
    except SQLAlchemyError as e:
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Server error")
