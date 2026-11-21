# SmartShop Backend Microservices Architecture

Production-grade, asynchronous backend built with **FastAPI**, **PostgreSQL** (with **asyncpg**), **SQLAlchemy 2.0 (Async)**, and **Alembic**.

---

## 🏛️ Architecture & Folder Structure

The project follows a **Domain-Driven Modular Microservices Architecture**, keeping business domains isolated and ready to be separated into standalone microservices or executed as a unified high-performance service:

```
backend/
├── docker-compose.yml              # Multi-container setup (PostgreSQL 16 + FastAPI)
├── Dockerfile                      # Production Docker container image
├── pyproject.toml                  # Project metadata & packaging
├── requirements.txt                # Locked Python dependencies
├── alembic.ini                     # Database migration configuration
├── .env.example                    # Environment variable template
├── .env                            # Active environment configuration
│
├── alembic/                        # Async database migrations
│   ├── env.py                      # Async SQLAlchemy engine configuration
│   ├── script.py.mako              # Migration file template
│   └── versions/
│       └── 001_initial_schema.py   # Initial database schema for tables
│
└── app/                            # Application Root
    ├── main.py                     # FastAPI application factory & lifespan
    │
    ├── core/                       # Shared infrastructure & configuration
    │   ├── config.py               # Pydantic v2 Settings (.env validation)
    │   ├── database.py             # Async SQLAlchemy 2.0 engine & Session generator
    │   └── exceptions.py           # Standardized HTTP and domain exceptions
    │
    ├── common/                     # Reusable utilities
    │   ├── pagination.py           # Generic paginated response (page, size, total, pages)
    │   └── responses.py            # Unified API response envelopes
    │
    ├── services/                   # Modular Microservices Domains
    │   │
    │   ├── catalog/                # 1. Product & Inventory Service
    │   │   ├── models.py           # Product & Category SQLAlchemy models
    │   │   ├── schemas.py          # Pydantic request & response schemas
    │   │   ├── repository.py       # Async database queries & filters
    │   │   ├── service.py          # Business rules (stock check, low stock)
    │   │   └── router.py           # Endpoints: /api/v1/products, /api/v1/categories
    │   │
    │   ├── orders/                 # 2. Orders & Billing (POS) Service
    │   │   ├── models.py           # Order & OrderItem models
    │   │   ├── schemas.py          # Order creation & checkout schemas
    │   │   ├── repository.py       # Atomic database operations
    │   │   ├── service.py          # Inventory deduction & order generation
    │   │   └── router.py           # Endpoints: /api/v1/orders
    │   │
    │   └── analytics/              # 3. Analytics & KPI Service
    │       ├── schemas.py          # KPI, category distribution, & trend schemas
    │       ├── service.py          # Metrics calculation (Sales, Orders, Revenue)
    │       └── router.py           # Endpoints: /api/v1/analytics
    │
    └── scripts/
        └── seed_data.py            # Supermarket seed script with realistic items
```

---

## 🚀 Quick Start

### Option A: Using Docker (Recommended for PostgreSQL)

1. **Start PostgreSQL and FastAPI with Docker Compose:**
   ```bash
   cd backend
   docker-compose up --build -d
   ```

2. **Run Alembic Migrations:**
   ```bash
   docker-compose exec backend alembic upgrade head
   ```

3. **Seed Initial Supermarket Catalog:**
   ```bash
   docker-compose exec backend python -m app.scripts.seed_data
   ```

4. **Access the API:**
   - Interactive Swagger UI: [http://localhost:8000/api/v1/docs](http://localhost:8000/api/v1/docs)
   - Alternative ReDoc: [http://localhost:8000/api/v1/redoc](http://localhost:8000/api/v1/redoc)
   - Health Check: [http://localhost:8000/health](http://localhost:8000/health)

---

### Option B: Local Python Development

1. **Create and Activate Virtual Environment:**
   ```bash
   cd backend
   python -m venv venv
   # Windows PowerShell:
   .\venv\Scripts\Activate.ps1
   # macOS/Linux:
   source venv/bin/activate
   ```

2. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run Seed Script (creates tables & initial data):**
   ```bash
   python -m app.scripts.seed_data
   ```

4. **Start the FastAPI Dev Server:**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

---

## 🗄️ Database Migrations with Alembic

- **Create a new migration after editing models:**
  ```bash
  alembic revision --autogenerate -m "add_new_field"
  ```
- **Apply migrations to database:**
  ```bash
  alembic upgrade head
  ```
- **Rollback last migration:**
  ```bash
  alembic downgrade -1
  ```

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/products` | Paginated product list with section filter (`category_slug`), search, and pagination (`page`, `page_size`=5,10,20,50,100) |
| `GET` | `/api/v1/products/{id}` | Retrieve product details |
| `POST` | `/api/v1/products` | Add new product to supermarket inventory |
| `PUT` | `/api/v1/products/{id}` | Update product stock, price, or details |
| `GET` | `/api/v1/categories` | List all product sections with item counts |
| `GET` | `/api/v1/orders` | Live stream of customer orders/bills |
| `POST` | `/api/v1/orders` | Checkout POS bill, deduct inventory stock |
| `GET` | `/api/v1/analytics/kpis` | 4 Sales Dashboard KPIs (Total Sales, Today's Sales, Orders, Monthly Revenue) |
| `GET` | `/api/v1/analytics/categories`| Category distribution breakdown (for Donut Chart) |
| `GET` | `/api/v1/analytics/top-selling`| Best-selling items ranked by revenue |
| `GET` | `/api/v1/analytics/monthly-revenue`| Monthly revenue progression history |

---

## 🔌 Connecting to TailAdmin Vue Frontend

The API has CORS pre-configured for `http://localhost:5173`. Frontend composables can call endpoints directly using standard `fetch` or `axios`.

