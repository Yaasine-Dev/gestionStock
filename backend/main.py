from fastapi import FastAPI
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Product

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/products")
def get_products():
    db: Session = next(get_db())
    products = db.query(Product).all()
    return products
