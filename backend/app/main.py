from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import Base, engine
from app.services.catalog.router import category_router, router as catalog_router
from app.services.orders.router import router as orders_router
from app.services.analytics.router import router as analytics_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure database tables are created (development convenience)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown: Close database connection pool
    await engine.dispose()


def create_application() -> FastAPI:
    application = FastAPI(
        title=settings.PROJECT_NAME,
        version="1.0.0",
        description="SmartShop Supermarket Management Microservices REST API (FastAPI, PostgreSQL/SQLite, Alembic)",
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        docs_url=f"{settings.API_V1_STR}/docs",
        redoc_url=f"{settings.API_V1_STR}/redoc",
        lifespan=lifespan,
    )

    # Configure CORS
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include Domain Microservices Routers
    api_prefix = settings.API_V1_STR
    application.include_router(catalog_router, prefix=api_prefix)
    application.include_router(category_router, prefix=api_prefix)
    application.include_router(orders_router, prefix=api_prefix)
    application.include_router(analytics_router, prefix=api_prefix)

    @application.get("/health", tags=["Health"])
    async def health_check():
        return {
            "status": "healthy",
            "environment": settings.ENVIRONMENT,
            "version": "1.0.0",
            "database": "connected",
        }

    @application.get("/", tags=["Root"])
    async def root():
        return {
            "name": settings.PROJECT_NAME,
            "version": "1.0.0",
            "docs_url": f"{settings.API_V1_STR}/docs",
            "health_url": "/health",
        }

    return application


app = create_application()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)

