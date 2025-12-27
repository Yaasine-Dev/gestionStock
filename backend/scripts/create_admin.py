import os
import sys

# Ensure parent directory (project root) is on sys.path so sibling modules can be imported
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from database import SessionLocal
from models import User, RoleEnum
from tools.hash_password import hash_password

def create_admin(name: str, email: str, password: str):
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            print(f"User with email {email} already exists (id={existing.id})")
            return
        user = User(name=name, email=email, password=hash_password(password), role=RoleEnum.ADMIN)
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f"Created admin user id={user.id} email={user.email}")
    finally:
        db.close()

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 4:
        print("Usage: python create_admin.py <name> <email> <password>")
        sys.exit(1)
    name = sys.argv[1]
    email = sys.argv[2]
    password = sys.argv[3]
    create_admin(name, email, password)