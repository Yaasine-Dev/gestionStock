from pydantic import BaseModel, EmailStr
from typing import Optional, Literal


class ProductCreate(BaseModel):
    name: str
    price: float
    quantity: int = 0
    sku: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    supplier_id: Optional[int] = None
    image_url: Optional[str] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None
    sku: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    supplier_id: Optional[int] = None
    image_url: Optional[str] = None


class CategoryCreate(BaseModel):
    name: str


class CategoryUpdate(BaseModel):
    name: Optional[str] = None


class SupplierCreate(BaseModel):
    name: str
    phone: Optional[str] = None
    email: Optional[EmailStr] = None


class SupplierUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None


class OrderCreate(BaseModel):
    product_id: int
    quantity: int
    status: Optional[Literal["PENDING", "COMPLETED", "CANCELLED"]] = "PENDING"


class OrderUpdate(BaseModel):
    product_id: Optional[int] = None
    quantity: Optional[int] = None
    status: Optional[Literal["PENDING", "COMPLETED", "CANCELLED"]] = None


class StockMovementCreate(BaseModel):
    product_id: int
    type: Literal["IN", "OUT"]
    quantity: int


class StockAdjust(BaseModel):
    product_id: int
    quantity: int
    location: Optional[str] = None
    movement_type: Literal["IN", "OUT"]


# User schemas
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True
