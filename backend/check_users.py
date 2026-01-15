from dotenv import load_dotenv
load_dotenv()

from database import SessionLocal
from models import User
from tools.hash_password import hash_password

db = SessionLocal()

try:
    # Check connection
    users = db.query(User).all()
    print(f"Total users: {len(users)}")
    
    for user in users:
        print(f"\nUser: {user.email}")
        print(f"  Name: {user.name}")
        print(f"  Role: {user.role}")
        print(f"  Password hash: {user.password}")
    
    # Test password hash
    test_password = "admin123"
    hashed = hash_password(test_password)
    print(f"\nHash of 'admin123': {hashed}")
    
    # Check if admin exists
    admin = db.query(User).filter(User.email == "admin@stock.com").first()
    if admin:
        print(f"\nAdmin found!")
        print(f"Password matches: {hash_password('admin123') == admin.password}")
    else:
        print("\nNo admin user found!")
        
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()
