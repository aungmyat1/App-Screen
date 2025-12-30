"""
Main entry point for the Screenshot SaaS application.
"""
from fastapi import FastAPI
from .core.scrapers.appstore import AppStoreScraper
from .core.scrapers.playstore import PlayStoreScraper
from .core.cache import CacheManager
from .core.queue import QueueManager
from .core.storage import StorageManager, LocalStorage
import os


# Initialize FastAPI app
app = FastAPI(
    title="Screenshot SaaS API",
    description="An API for extracting screenshots from app stores",
    version="0.1.0"
)


@app.get("/")
async def root():
    """
    Root endpoint for the API.
    """
    return {"message": "Welcome to the Screenshot SaaS API"}


@app.get("/health")
async def health_check():
    """
    Health check endpoint.
    """
    return {"status": "healthy"}


# Example usage of the core components
@app.get("/test-setup")
async def test_setup():
    """
    Test endpoint to verify all core components are working.
    """
    try:
        # Test scraper initialization
        appstore_scraper = AppStoreScraper()
        playstore_scraper = PlayStoreScraper()
        
        # Test cache manager (assuming Redis is available)
        redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
        cache_manager = CacheManager(redis_url)
        
        # Test storage manager
        storage_backend = LocalStorage()
        storage_manager = StorageManager(storage_backend)
        
        # Test queue manager (assuming Redis is available)
        queue_manager = QueueManager(redis_url, redis_url)
        
        return {
            "status": "success",
            "components": {
                "appstore_scraper": True,
                "playstore_scraper": True,
                "cache_manager": True,
                "storage_manager": True,
                "queue_manager": True
            }
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)