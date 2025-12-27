from typing import List, Union
from fastapi import Depends, HTTPException, Header
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(x_user_id: int = Header(None), db: Session = Depends(get_db)):
    if x_user_id is None:
        raise HTTPException(status_code=401, detail="User ID header missing")
    user = db.query(User).filter(User.id == x_user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="Utilisateur non trouvé")
    return user


def role_dependency(required_roles: Union[str, List[str]]):
    roles = [required_roles] if isinstance(required_roles, str) else required_roles

    def _role_check(user: User = Depends(get_current_user)):
        user_role = user.role.value if hasattr(user.role, 'value') else str(user.role)
        if user_role not in roles:
            raise HTTPException(status_code=403, detail="Accès interdit")
        return user

    return _role_check
