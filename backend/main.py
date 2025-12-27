from fastapi import FastAPI
from routes import auth, products, categories, suppliers, orders, stock, stats, users

app = FastAPI(title="Stock Management App")

# Routes
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(categories.router)
app.include_router(suppliers.router)
app.include_router(orders.router)
app.include_router(stock.router)
app.include_router(stats.router)
app.include_router(users.router)

@app.get("/")
def root():
    return {"message": "Bienvenue dans Stock Management App"}
