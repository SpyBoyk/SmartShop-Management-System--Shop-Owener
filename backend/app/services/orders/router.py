from typing import Annotated
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.common.pagination import PaginatedResponse
from app.core.database import get_db
from app.services.orders.schemas import OrderCreate, OrderResponse
from app.services.orders.service import OrderService

router = APIRouter(prefix="/orders", tags=["Orders & Billing"])


@router.get("", response_model=PaginatedResponse[OrderResponse])
async def list_orders(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(15, ge=1, le=100, description="Page size"),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve live feed of processed customer orders / bills."""
    service = OrderService(db)
    items, total = await service.list_orders(page=page, page_size=page_size)
    return PaginatedResponse.create(items=items, total=total, page=page, page_size=page_size)


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Retrieve customer order details by order ID."""
    service = OrderService(db)
    return await service.get_order(order_id)


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    payload: OrderCreate,
    db: AsyncSession = Depends(get_db),
):
    """Process a new customer purchase bill at counter, updating inventory automatically."""
    service = OrderService(db)
    return await service.create_order(payload)

