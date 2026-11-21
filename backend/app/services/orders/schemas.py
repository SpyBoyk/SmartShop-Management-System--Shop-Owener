from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class OrderItemCreate(BaseModel):
    product_id: str
    quantity: int = Field(..., gt=0)


class OrderItemResponse(BaseModel):
    id: int
    product_id: str
    product_name: str
    category_name: str
    quantity: int
    unit_price: float
    total_price: float

    model_config = ConfigDict(from_attributes=True)


class OrderCreate(BaseModel):
    customer_name: Optional[str] = "Walk-in Customer"
    items: List[OrderItemCreate] = Field(..., min_length=1)
    apply_gst: bool = True
    gst_rate: float = 5.0


class OrderResponse(BaseModel):
    id: str
    customer_name: str
    subtotal: float
    tax_amount: float
    total: float
    status: str
    created_at: datetime
    items: List[OrderItemResponse] = []

    model_config = ConfigDict(from_attributes=True)

