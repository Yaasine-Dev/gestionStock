from database import engine, SessionLocal
from models import Base

try:
    # Test database connection
    connection = engine.connect()
    print("✅ Database connection successful")
    connection.close()
    
    # Test session creation
    db = SessionLocal()
    print("✅ Session creation successful")
    db.close()
    
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created/verified")
    
except Exception as e:
    print(f"❌ Database error: {e}")