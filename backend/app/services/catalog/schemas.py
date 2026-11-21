from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class CategoryBase(BaseModel):
    name: str = Field(..., max_length=100)
    slug: str = Field(..., max_length=100)
    description: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryResponse(CategoryBase):
    id: int
    product_count: int = 0
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProductBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    category_id: int
    price: float = Field(..., gt=0)
    stock: int = Field(default=0, ge=0)
    unit: str = Field(default="unit", max_length=30)
    barcode: Optional[str] = None
    is_active: bool = True


class ProductCreate(ProductBase):
    id: Optional[str] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category_id: Optional[int] = None
    price: Optional[float] = Field(None, gt=0)
    stock: Optional[int] = Field(None, ge=0)
    unit: Optional[str] = None
    barcode: Optional[str] = None
    is_active: Optional[bool] = None


class ProductResponse(BaseModel):
    id: str
    name: str
    category_id: int
    category_name: str
    price: float
    stock: int
    available: int
    unit: str
    barcode: Optional[str] = None
    is_active: bool
    sold: int = 0
    revenue: float = 0.0
    status: str = "In Stock"
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

