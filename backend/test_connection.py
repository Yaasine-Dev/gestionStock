from dotenv import load_dotenv
import os

load_dotenv()

print("Environment variables:")
print(f"DB_USER: {os.getenv('DB_USER')}")
print(f"DB_PASSWORD: {os.getenv('DB_PASSWORD')}")
print(f"DB_HOST: {os.getenv('DB_HOST')}")
print(f"DB_NAME: {os.getenv('DB_NAME')}")

from database import DATABASE_URL, engine
from sqlalchemy import text

print(f"\nDatabase URL: {DATABASE_URL}")

try:
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("\n✓ Database connection successful!")
        
        # Test users table
        result = conn.execute(text("SELECT * FROM users"))
        users = result.fetchall()
        print(f"\n✓ Found {len(users)} users in database")
        for user in users:
            print(f"  - {user}")
            
except Exception as e:
    print(f"\n✗ Database connection failed: {e}")
