from typing import List
from pydantic import BaseModel


class DashboardKPIsResponse(BaseModel):
    total_sales: float
    today_sales: float
    total_orders: int
    today_orders: int
    monthly_revenue: float
    currency: str = "₹"
    sales_growth: float = 12.5
    orders_growth: float = 8.4
    revenue_growth: float = 14.2


class CategoryDistributionItem(BaseModel):
    name: str
    value: float
    percentage: int


class TopSellingProductItem(BaseModel):
    id: str
    name: str
    category: str
    price: float
    quantity: int
    revenue: float


class SalesTrendItem(BaseModel):
    label: str
    value: float


class MonthlyRevenueItem(BaseModel):
    month: str
    revenue: float

