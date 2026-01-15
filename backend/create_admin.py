from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, User, RoleEnum
from tools.hash_password import hash_password

# Create tables
Base.metadata.create_all(bind=engine)

# Create admin user
db = SessionLocal()
try:
    # Check if admin already exists
    existing_admin = db.query(User).filter(User.email == "admin@admin.com").first()
    if not existing_admin:
        admin_user = User(
            name="Admin",
            email="admin@admin.com",
            password=hash_password("admin"),
            role=RoleEnum.ADMIN
        )
        db.add(admin_user)
        db.commit()
        print("Admin user created successfully!")
        print("Email: admin@admin.com")
        print("Password: admin")
    else:
        print("Admin user already exists!")
finally:
    db.close()