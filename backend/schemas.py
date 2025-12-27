from pydantic import BaseModel, EmailStr
from typing import Optional, Literal


class ProductCreate(BaseModel):
    name: str
    price: float
    quantity: int


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None


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


class OrderUpdate(BaseModel):
    quantity: Optional[int] = None
    status: Optional[Literal["PENDING", "COMPLETED", "CANCELLED"]] = None


class StockMovementCreate(BaseModel):
    product_id: int
    type: Literal["IN", "OUT"]
    quantity: int


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
        orm_mode = True
