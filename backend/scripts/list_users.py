import os
import sys

# ensure project root on path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from database import SessionLocal
from models import User

def list_users():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        if not users:
            print("No users found in DB.")
            return
        for u in users:
            role = getattr(u.role, 'value', str(u.role))
            print(f"id={u.id} email={u.email} name={u.name} role={role} password_hash={u.password}")
    finally:
        db.close()

if __name__ == '__main__':
    list_users()
