from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from src.api.middleware.rate_limit import RateLimitMiddleware
from src.api.middleware.auth import AuthMiddleware
from src.api.routes.screenshots import router as screenshots_router
from src.api.routes.users import router as users_router
from src.api.routes.scrape_jobs import router as jobs_router
from src.api.routes.screenshots_crud import router as screenshots_crud_router
from src.api.routes.api_usage import router as api_usage_router

app = FastAPI(
    title="Screenshot Scraper API",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(AuthMiddleware)

# Include routers
app.include_router(screenshots_router)
app.include_router(users_router)
app.include_router(jobs_router)
app.include_router(screenshots_crud_router)
app.include_router(api_usage_router)

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "2.0.0"}