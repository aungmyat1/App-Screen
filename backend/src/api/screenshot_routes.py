from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

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
    
    # Simulate scraping
    screenshots = [
        f"https://example.com/screenshots/{request.app_id}/1.png",
        f"https://example.com/screenshots/{request.app_id}/2.png",
    ]
    
    return ScreenshotResponse(
        app_id=request.app_id,
        screenshots=screenshots,
        store=request.store
    )

@router.get("/health", include_in_schema=False)
async def health_check():
    return {"status": "ok"}