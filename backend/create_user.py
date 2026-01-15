from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, User, RoleEnum
from tools.hash_password import hash_password

# Create tables
Base.metadata.create_all(bind=engine)

# Create a session
db = SessionLocal()

try:
    # Check if admin user already exists
    existing_user = db.query(User).filter(User.email == "admin@test.com").first()
    
    if not existing_user:
        # Create admin user
        admin_user = User(
            name="Admin User",
            email="admin@test.com",
            password=hash_password("1234"),
            role=RoleEnum.ADMIN
        )
        db.add(admin_user)
        db.commit()
        print("Admin user created successfully!")
        print("Email: admin@test.com")
        print("Password: 1234")
    else:
        print("Admin user already exists!")
        print("Email: admin@test.com")
        print("Password: 1234")
        
finally:
    db.close()