from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os

# Check if Playwright is available
try:
    from playwright.async_api import async_playwright
    PLAYWRIGHT_AVAILABLE = True
except ImportError:
    PLAYWRIGHT_AVAILABLE = False

router = APIRouter(
    prefix="/screenshots",
    tags=["screenshots"],
    responses={404: {"description": "Not found"}},
)

class ScreenshotRequest(BaseModel):
    app_id: str
    store: str  # "playstore" or "appstore"

class ScreenshotResponse(BaseModel):
    app_id: str
    screenshots: List[str]
    store: str

@router.post("/scrape", response_model=ScreenshotResponse)
async def scrape_screenshots(request: ScreenshotRequest):
    """
    Scrape screenshots for an app from the specified store.
    """
    # This is a placeholder implementation
    # In a real implementation, this would call the appropriate scraper
    
    if request.store.lower() not in ["playstore", "appstore"]:
        raise HTTPException(status_code=400, detail="Invalid store specified")
    
    # Check if Playwright is available
    if not PLAYWRIGHT_AVAILABLE:
        # If we're in development mode, we can return mock data
        # Otherwise, return an error
        if os.getenv("ENVIRONMENT") == "development":
            # Simulate scraping with mock data for development
            screenshots = [
                f"https://example.com/screenshots/{request.app_id}/1.png",
                f"https://example.com/screenshots/{request.app_id}/2.png",
            ]
            
            return ScreenshotResponse(
                app_id=request.app_id,
                screenshots=screenshots,
                store=request.store
            )
        else:
            raise HTTPException(
                status_code=503,
                detail="Screenshot service temporarily unavailable"
            )
    
    # If Playwright is available, use the actual scrapers
    # Import the scrapers here to avoid import errors when Playwright is not available
    if request.store.lower() == "playstore":
        from ..core.playstore_scraper import PlayStoreScraper
        scraper = PlayStoreScraper(headless=True)
    else:  # appstore
        from ..core.appstore_scraper import AppStoreScraper
        scraper = AppStoreScraper(headless=True)
    
    # Validate app ID
    if not scraper.validate_app_id(request.app_id):
        raise HTTPException(status_code=400, detail="Invalid app ID format for the specified store")
    
    try:
        screenshots = await scraper.scrape_screenshots(request.app_id)
        return ScreenshotResponse(
            app_id=request.app_id,
            screenshots=screenshots,
            store=request.store
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error scraping screenshots: {str(e)}"
        )

@router.get("/health", include_in_schema=False)
async def health_check():
    return {"status": "ok", "playwright_available": PLAYWRIGHT_AVAILABLE}