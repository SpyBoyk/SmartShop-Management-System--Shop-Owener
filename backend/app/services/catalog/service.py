import uuid
from typing import Optional, Sequence
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import EntityNotFoundException
from app.services.catalog.models import Category, Product
from app.services.catalog.repository import CatalogRepository
from app.services.catalog.schemas import CategoryCreate, ProductCreate, ProductResponse, ProductUpdate


class CatalogService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = CatalogRepository(db)

    async def list_categories(self) -> Sequence[Category]:
        return await self.repo.get_categories()

    async def create_category(self, payload: CategoryCreate) -> Category:
        category = Category(
            name=payload.name,
            slug=payload.slug,
            description=payload.description,
        )
        return await self.repo.create_category(category)

    async def list_products(
        self,
        category_id: Optional[int] = None,
        category_slug: Optional[str] = None,
        search: Optional[str] = None,
        page: int = 1,
        page_size: int = 10,
    ) -> tuple[Sequence[ProductResponse], int]:
        skip = (page - 1) * page_size
        total = await self.repo.count_products(
            category_id=category_id,
            category_slug=category_slug,
            search=search,
        )
        products = await self.repo.get_products(
            category_id=category_id,
            category_slug=category_slug,
            search=search,
            skip=skip,
            limit=page_size,
        )

        # Build responses with computed status and available fields
        items = []
        for p in products:
            status = "In Stock"
            if p.stock <= 0:
                status = "Out of Stock"
            elif p.stock < 15:
                status = "Low Stock"

            items.append(
                ProductResponse(
                    id=p.id,
                    name=p.name,
                    category_id=p.category_id,
                    category_name=p.category_name,
                    price=float(p.price),
                    stock=p.stock,
                    available=p.stock,
                    unit=p.unit,
                    barcode=p.barcode,
                    is_active=p.is_active,
                    status=status,
                    created_at=p.created_at,
                    updated_at=p.updated_at,
                )
            )

        return items, total

    async def get_product(self, product_id: str) -> ProductResponse:
        product = await self.repo.get_product_by_id(product_id)
        if not product:
            raise EntityNotFoundException("Product", product_id)

        status = "In Stock" if product.stock > 0 else "Out of Stock"
        if 0 < product.stock < 15:
            status = "Low Stock"

        return ProductResponse(
            id=product.id,
            name=product.name,
            category_id=product.category_id,
            category_name=product.category_name,
            price=float(product.price),
            stock=product.stock,
            available=product.stock,
            unit=product.unit,
            barcode=product.barcode,
            is_active=product.is_active,
            status=status,
            created_at=product.created_at,
            updated_at=product.updated_at,
        )

    async def create_product(self, payload: ProductCreate) -> ProductResponse:
        category = await self.repo.get_category_by_id(payload.category_id)
        if not category:
            raise EntityNotFoundException("Category", payload.category_id)

        product_id = payload.id or f"prod-{uuid.uuid4().hex[:8]}"
        product = Product(
            id=product_id,
            name=payload.name,
            category_id=payload.category_id,
            category_name=category.name,
            price=payload.price,
            stock=payload.stock,
            unit=payload.unit,
            barcode=payload.barcode,
            is_active=payload.is_active,
        )
        created = await self.repo.create_product(product)
        return await self.get_product(created.id)

    async def update_product(self, product_id: str, payload: ProductUpdate) -> ProductResponse:
        product = await self.repo.get_product_by_id(product_id)
        if not product:
            raise EntityNotFoundException("Product", product_id)

        if payload.category_id is not None:
            category = await self.repo.get_category_by_id(payload.category_id)
            if not category:
                raise EntityNotFoundException("Category", payload.category_id)
            product.category_id = category.id
            product.category_name = category.name

        if payload.name is not None:
            product.name = payload.name
        if payload.price is not None:
            product.price = payload.price
        if payload.stock is not None:
            product.stock = payload.stock
        if payload.unit is not None:
            product.unit = payload.unit
        if payload.barcode is not None:
            product.barcode = payload.barcode
        if payload.is_active is not None:
            product.is_active = payload.is_active

        updated = await self.repo.update_product(product)
        return await self.get_product(updated.id)

