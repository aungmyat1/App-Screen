from fastapi import FastAPI
from .api.screenshot_routes import router as screenshot_router
from .database.connection import Base, engine

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AppScreens API",
    description="API for downloading app store screenshots",
    version="0.1.0"
)

# Include routers
app.include_router(screenshot_router)

@app.get("/")
async def root():
    return {"message": "Welcome to the AppScreens API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}