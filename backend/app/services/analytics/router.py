from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.analytics.schemas import (
    CategoryDistributionItem,
    DashboardKPIsResponse,
    MonthlyRevenueItem,
    TopSellingProductItem,
)
from app.services.analytics.service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Analytics & KPIs"])


@router.get("/kpis", response_model=DashboardKPIsResponse)
async def get_dashboard_kpis(
    db: AsyncSession = Depends(get_db),
):
    """Retrieve top-level KPI metrics (Total Sales, Today's Sales, Total Orders, Monthly Revenue)."""
    service = AnalyticsService(db)
    return await service.get_dashboard_kpis()


@router.get("/categories", response_model=List[CategoryDistributionItem])
async def get_category_distribution(
    db: AsyncSession = Depends(get_db),
):
    """Retrieve product sales distribution across categories for donut/pie charts."""
    service = AnalyticsService(db)
    return await service.get_category_distribution()


@router.get("/top-selling", response_model=List[TopSellingProductItem])
async def get_top_selling_products(
    limit: int = Query(8, ge=1, le=50, description="Number of top products to return"),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve top-selling items ranked by demand and sales revenue."""
    service = AnalyticsService(db)
    return await service.get_top_selling_products(limit=limit)


@router.get("/monthly-revenue", response_model=List[MonthlyRevenueItem])
async def get_monthly_revenue_history(
    db: AsyncSession = Depends(get_db),
):
    """Retrieve monthly revenue bar chart progression."""
    service = AnalyticsService(db)
    return await service.get_monthly_revenue_history()

