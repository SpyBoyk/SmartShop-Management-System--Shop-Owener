import random
from datetime import datetime
from typing import Sequence
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import EntityNotFoundException, InsufficientStockException
from app.services.catalog.repository import CatalogRepository
from app.services.orders.models import Order, OrderItem
from app.services.orders.repository import OrderRepository
from app.services.orders.schemas import OrderCreate, OrderResponse


class OrderService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = OrderRepository(db)
        self.catalog_repo = CatalogRepository(db)

    async def list_orders(self, page: int = 1, page_size: int = 15) -> tuple[Sequence[OrderResponse], int]:
        skip = (page - 1) * page_size
        total = await self.repo.count_orders()
        orders = await self.repo.get_orders(skip=skip, limit=page_size)

        responses = [
            OrderResponse.model_validate(o) for o in orders
        ]
        return responses, total

    async def get_order(self, order_id: str) -> OrderResponse:
        order = await self.repo.get_order_by_id(order_id)
        if not order:
            raise EntityNotFoundException("Order", order_id)
        return OrderResponse.model_validate(order)

    async def create_order(self, payload: OrderCreate) -> OrderResponse:
        order_id = f"ORD-{random.randint(1000, 9999)}"
        subtotal = 0.0
        line_items = []

        # Validate each item and deduct stock
        for item_in in payload.items:
            product = await self.catalog_repo.get_product_by_id(item_in.product_id)
            if not product:
                raise EntityNotFoundException("Product", item_in.product_id)

            if product.stock < item_in.quantity:
                raise InsufficientStockException(
                    product_name=product.name,
                    available=product.stock,
                    requested=item_in.quantity,
                )

            # Deduct stock
            product.stock -= item_in.quantity
            await self.catalog_repo.update_product(product)

            # Calculate item total
            unit_price = float(product.price)
            item_total = round(unit_price * item_in.quantity, 2)
            subtotal += item_total

            line_items.append(
                OrderItem(
                    order_id=order_id,
                    product_id=product.id,
                    product_name=product.name,
                    category_name=product.category_name,
                    quantity=item_in.quantity,
                    unit_price=unit_price,
                    total_price=item_total,
                )
            )

        tax_amount = round((subtotal * payload.gst_rate) / 100.0, 2) if payload.apply_gst else 0.0
        final_total = round(subtotal + tax_amount, 2)

        order = Order(
            id=order_id,
            customer_name=payload.customer_name or "Walk-in Customer",
            subtotal=subtotal,
            tax_amount=tax_amount,
            total=final_total,
            status="Paid",
            items=line_items,
        )

        created = await self.repo.create_order(order)
        return OrderResponse.model_validate(created)

