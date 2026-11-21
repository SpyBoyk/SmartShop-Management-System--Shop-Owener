from typing import Annotated, Optional, Sequence
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.common.pagination import PaginatedResponse
from app.core.database import get_db
from app.services.catalog.schemas import CategoryCreate, CategoryResponse, ProductCreate, ProductResponse, ProductUpdate
from app.services.catalog.service import CatalogService

router = APIRouter(prefix="/products", tags=["Catalog & Products"])


@router.get("", response_model=PaginatedResponse[ProductResponse])
async def list_products(
    category_slug: Optional[str] = Query(None, description="Category slug to filter by (e.g. grains-pulses)"),
    category_id: Optional[int] = Query(None, description="Filter by Category ID"),
    search: Optional[str] = Query(None, description="Search term for product name"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Page size (5, 10, 20, 50, 100)"),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve paginated list of supermarket products with filtering and inventory status."""
    service = CatalogService(db)
    items, total = await service.list_products(
        category_id=category_id,
        category_slug=category_slug,
        search=search,
        page=page,
        page_size=page_size,
    )
    return PaginatedResponse.create(items=items, total=total, page=page, page_size=page_size)


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get single product details by ID."""
    service = CatalogService(db)
    return await service.get_product(product_id)


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    payload: ProductCreate,
    db: AsyncSession = Depends(get_db),
):
    """Add a new product to supermarket inventory."""
    service = CatalogService(db)
    return await service.create_product(payload)


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    payload: ProductUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update product details or stock quantity."""
    service = CatalogService(db)
    return await service.update_product(product_id, payload)


# Categories Router
category_router = APIRouter(prefix="/categories", tags=["Categories"])


@category_router.get("", response_model=Sequence[CategoryResponse])
async def list_categories(
    db: AsyncSession = Depends(get_db),
):
    """List all supermarket product categories."""
    service = CatalogService(db)
    return await service.list_categories()


@category_router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    payload: CategoryCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new product category."""
    service = CatalogService(db)
    return await service.create_category(payload)

