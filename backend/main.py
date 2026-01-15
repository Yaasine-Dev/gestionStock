from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from routes import auth, products, categories, suppliers, orders, stock, stats, users, upload
from pathlib import Path

app = FastAPI(title="Stock Management App")
from fastapi.middleware.cors import CORSMiddleware

# Create uploads directory
Path("uploads/products").mkdir(parents=True, exist_ok=True)

# Serve static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Routes
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(categories.router)
app.include_router(suppliers.router)
app.include_router(orders.router)
app.include_router(stock.router)
app.include_router(stats.router)
app.include_router(users.router)
app.include_router(upload.router)

@app.get("/")
def root():
    return {"message": "Bienvenue dans Stock Management App"}
