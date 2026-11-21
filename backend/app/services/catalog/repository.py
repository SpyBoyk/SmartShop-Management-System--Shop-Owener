from typing import Optional, Sequence
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.catalog.models import Category, Product


class CatalogRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_categories(self) -> Sequence[Category]:
        stmt = select(Category).order_by(Category.name)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_category_by_id(self, category_id: int) -> Optional[Category]:
        stmt = select(Category).where(Category.id == category_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_category_by_slug(self, slug: str) -> Optional[Category]:
        stmt = select(Category).where(Category.slug == slug)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def create_category(self, category: Category) -> Category:
        self.db.add(category)
        await self.db.flush()
        await self.db.refresh(category)
        return category

    async def get_products(
        self,
        category_id: Optional[int] = None,
        category_slug: Optional[str] = None,
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> Sequence[Product]:
        stmt = select(Product).where(Product.is_active == True)

        if category_id:
            stmt = stmt.where(Product.category_id == category_id)
        elif category_slug and category_slug != "all":
            # Match by slug or category name substring
            stmt = stmt.join(Product.category_rel).where(
                Category.slug == category_slug
            )

        if search:
            search_term = f"%{search.strip()}%"
            stmt = stmt.where(Product.name.ilike(search_term))

        stmt = stmt.order_by(Product.name).offset(skip).limit(limit)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def count_products(
        self,
        category_id: Optional[int] = None,
        category_slug: Optional[str] = None,
        search: Optional[str] = None,
    ) -> int:
        stmt = select(func.count(Product.id)).where(Product.is_active == True)

        if category_id:
            stmt = stmt.where(Product.category_id == category_id)
        elif category_slug and category_slug != "all":
            stmt = stmt.join(Product.category_rel).where(
                Category.slug == category_slug
            )

        if search:
            search_term = f"%{search.strip()}%"
            stmt = stmt.where(Product.name.ilike(search_term))

        result = await self.db.execute(stmt)
        return result.scalar_one()

    async def get_product_by_id(self, product_id: str) -> Optional[Product]:
        stmt = select(Product).where(Product.id == product_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def create_product(self, product: Product) -> Product:
        self.db.add(product)
        await self.db.flush()
        await self.db.refresh(product)
        return product

    async def update_product(self, product: Product) -> Product:
        await self.db.flush()
        await self.db.refresh(product)
        return product

