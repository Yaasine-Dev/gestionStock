from dotenv import load_dotenv
load_dotenv()

from database import SessionLocal
from models import User
from tools.hash_password import hash_password

db = SessionLocal()

try:
    admin = db.query(User).filter(User.email == "admin@stock.com").first()
    
    if admin:
        # Update password to SHA-256 hash of 'admin123'
        admin.password = hash_password("admin123")
        db.commit()
        print("Admin password updated successfully!")
        print(f"New hash: {admin.password}")
    else:
        print("Admin user not found!")
        
except Exception as e:
    print(f"Error: {e}")
    db.rollback()
finally:
    db.close()
