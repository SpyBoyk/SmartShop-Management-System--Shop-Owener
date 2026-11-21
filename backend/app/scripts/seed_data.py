import asyncio
import random
from datetime import datetime, timedelta
from sqlalchemy import select
from app.core.database import AsyncSessionLocal, Base, engine
from app.services.catalog.models import Category, Product
from app.services.orders.models import Order, OrderItem

CATEGORIES = [
    {"name": "Grains & Pulses", "slug": "grains-pulses", "desc": "Rice, wheat flour, lentils, and pulses"},
    {"name": "Oils & Ghee", "slug": "oils-ghee", "desc": "Refined oils, mustard oil, and pure cow ghee"},
    {"name": "Dairy & Bakery", "slug": "dairy-bakery", "desc": "Milk, butter, fresh bread, and dairy items"},
    {"name": "Snacks & Biscuits", "slug": "snacks-biscuits", "desc": "Biscuits, wafers, noodles, and namkeen"},
    {"name": "Beverages", "slug": "beverages", "desc": "Tea, instant coffee, and fruit juices"},
    {"name": "Household & Care", "slug": "household-care", "desc": "Detergents, soaps, and oral care"},
    {"name": "Daily Essentials", "slug": "daily-essentials", "desc": "Sugar, iodized salt, and staple spices"},
]

PRODUCTS = [
    # Grains & Pulses
    {"id": "p1", "name": "Basmati Rice (5kg)", "category_slug": "grains-pulses", "price": 420.0, "stock": 45, "unit": "bag", "barcode": "8901234001"},
    {"id": "p2", "name": "Whole Wheat Atta (10kg)", "category_slug": "grains-pulses", "price": 380.0, "stock": 32, "unit": "bag", "barcode": "8901234002"},
    {"id": "p7", "name": "Toor Dal Premium (1kg)", "category_slug": "grains-pulses", "price": 175.0, "stock": 35, "unit": "kg", "barcode": "8901234007"},
    {"id": "p15", "name": "Moong Dal Special (1kg)", "category_slug": "grains-pulses", "price": 150.0, "stock": 26, "unit": "kg", "barcode": "8901234015"},

    # Oils & Ghee
    {"id": "p3", "name": "Refined Mustard Oil (1L)", "category_slug": "oils-ghee", "price": 165.0, "stock": 28, "unit": "bottle", "barcode": "8901234003"},
    {"id": "p4", "name": "Pure Cow Ghee (1L)", "category_slug": "oils-ghee", "price": 620.0, "stock": 15, "unit": "jar", "barcode": "8901234004"},
    {"id": "p16", "name": "Fortune Sunflower Oil (1L)", "category_slug": "oils-ghee", "price": 145.0, "stock": 40, "unit": "pouch", "barcode": "8901234016"},

    # Dairy & Bakery
    {"id": "p8", "name": "Amul Butter (500g)", "category_slug": "dairy-bakery", "price": 275.0, "stock": 18, "unit": "pack", "barcode": "8901234008"},
    {"id": "p17", "name": "Britannia Milk Bread (400g)", "category_slug": "dairy-bakery", "price": 45.0, "stock": 25, "unit": "pack", "barcode": "8901234017"},
    {"id": "p18", "name": "Amul Taaza Milk (1L)", "category_slug": "dairy-bakery", "price": 68.0, "stock": 50, "unit": "pack", "barcode": "8901234018"},

    # Snacks & Biscuits
    {"id": "p9", "name": "Parle-G Gold (800g)", "category_slug": "snacks-biscuits", "price": 95.0, "stock": 50, "unit": "pack", "barcode": "8901234009"},
    {"id": "p10", "name": "Haldiram Bhujia (400g)", "category_slug": "snacks-biscuits", "price": 130.0, "stock": 22, "unit": "pack", "barcode": "8901234010"},
    {"id": "p13", "name": "Maggi Noodles (Pack of 12)", "category_slug": "snacks-biscuits", "price": 168.0, "stock": 30, "unit": "pack", "barcode": "8901234013"},
    {"id": "p19", "name": "Lay's Classic Salted Combo", "category_slug": "snacks-biscuits", "price": 80.0, "stock": 36, "unit": "pack", "barcode": "8901234019"},

    # Beverages
    {"id": "p6", "name": "Tata Tea Gold (500g)", "category_slug": "beverages", "price": 290.0, "stock": 24, "unit": "pack", "barcode": "8901234006"},
    {"id": "p14", "name": "Nescafe Classic Coffee (100g)", "category_slug": "beverages", "price": 340.0, "stock": 12, "unit": "jar", "barcode": "8901234014"},
    {"id": "p20", "name": "Real Mixed Fruit Juice (1L)", "category_slug": "beverages", "price": 125.0, "stock": 20, "unit": "tetra", "barcode": "8901234020"},

    # Household & Care
    {"id": "p11", "name": "Surf Excel Detergent (2kg)", "category_slug": "household-care", "price": 280.0, "stock": 16, "unit": "pack", "barcode": "8901234011"},
    {"id": "p12", "name": "Dettol Soap (Combo 4)", "category_slug": "household-care", "price": 195.0, "stock": 8, "unit": "pack", "barcode": "8901234012"},
    {"id": "p21", "name": "Colgate Strong Teeth (300g)", "category_slug": "household-care", "price": 130.0, "stock": 42, "unit": "pack", "barcode": "8901234021"},
    {"id": "p22", "name": "Vim Dishwash Gel (500ml)", "category_slug": "household-care", "price": 99.0, "stock": 30, "unit": "bottle", "barcode": "8901234022"},

    # Daily Essentials
    {"id": "p5", "name": "Crystal Sugar (1kg)", "category_slug": "daily-essentials", "price": 48.0, "stock": 80, "unit": "kg", "barcode": "8901234005"},
    {"id": "p23", "name": "Tata Iodized Salt (1kg)", "category_slug": "daily-essentials", "price": 28.0, "stock": 95, "unit": "pouch", "barcode": "8901234023"},
]


async def seed():
    print("🌱 Connecting to database and creating tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # Check if already seeded
        cat_check = await session.execute(select(Category))
        if cat_check.first():
            print("✓ Database already seeded. Skipping.")
            return

        print("📦 Seeding categories...")
        cat_map = {}
        for c_data in CATEGORIES:
            cat = Category(name=c_data["name"], slug=c_data["slug"], description=c_data["desc"])
            session.add(cat)
            await session.flush()
            cat_map[c_data["slug"]] = cat

        print("🛒 Seeding products...")
        product_objs = {}
        for p_data in PRODUCTS:
            cat = cat_map[p_data["category_slug"]]
            prod = Product(
                id=p_data["id"],
                name=p_data["name"],
                category_id=cat.id,
                category_name=cat.name,
                price=p_data["price"],
                stock=p_data["stock"],
                unit=p_data["unit"],
                barcode=p_data["barcode"],
            )
            session.add(prod)
            product_objs[p_data["id"]] = prod
        await session.flush()

        print("🧾 Seeding initial customer orders & sales history...")
        customers = ["Amit Sharma", "Pooja Verma", "Suresh Patel", "Rahul Gupta", "Neha Singh"]
        now = datetime.now()

        # Seed orders across today and previous days
        for i in range(12):
            order_id = f"ORD-{8920 + i}"
            customer = customers[i % len(customers)]
            order_time = now - timedelta(hours=i * 3, minutes=random.randint(5, 50))

            # Pick 2-4 random items
            chosen_keys = random.sample(list(product_objs.keys()), random.randint(2, 4))
            subtotal = 0.0
            order_items = []

            for p_key in chosen_keys:
                prod = product_objs[p_key]
                qty = random.randint(1, 3)
                total_p = round(float(prod.price) * qty, 2)
                subtotal += total_p
                order_items.append(
                    OrderItem(
                        order_id=order_id,
                        product_id=prod.id,
                        product_name=prod.name,
                        category_name=prod.category_name,
                        quantity=qty,
                        unit_price=float(prod.price),
                        total_price=total_p,
                    )
                )

            tax = round(subtotal * 0.05, 2)
            total = round(subtotal + tax, 2)

            order = Order(
                id=order_id,
                customer_name=customer,
                subtotal=subtotal,
                tax_amount=tax,
                total=total,
                status="Paid",
                created_at=order_time,
                items=order_items,
            )
            session.add(order)

        await session.commit()
        print("🎉 Successfully seeded SmartShop database!")


if __name__ == "__main__":
    asyncio.run(seed())

