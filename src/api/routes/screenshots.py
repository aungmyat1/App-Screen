from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

# Import Celery tasks
try:
    from backend.src.workers.tasks import scrape_playstore, scrape_appstore, download_screenshots
    CELERY_AVAILABLE = True
except ImportError:
    CELERY_AVAILABLE = False
    print("Warning: Celery not available. Using synchronous processing.")

router = APIRouter(prefix="/api/v1/screenshots", tags=["screenshots"])

# Data models (in a real app, these would be imported from a models module)
class ScrapeRequest(BaseModel):
    app_id: str
    store: str  # "playstore" or "appstore"
    force_refresh: Optional[bool] = False

class ScrapeResponse(BaseModel):
    job_id: int
    status: str
    estimated_time: str

class JobStatusResponse(BaseModel):
    job_id: int
    status: str
    screenshots: List[str]
    progress: Optional[float] = None

class ScreenshotResponse(BaseModel):
    id: int
    job_id: int
    url: str
    device_type: Optional[str] = None
    resolution: Optional[str] = None
    file_size: Optional[int] = None
    created_at: datetime

# Placeholder functions for demonstration
async def get_current_user():
    class User:
        def __init__(self):
            self.id = 1
            self.quota_remaining = 10
            self.tier = 'pro'
    return User()

async def create_scrape_job(user_id, request):
    class Job:
        def __init__(self):
            self.id = 12345
    return Job()

async def execute_scrape_job(job_id, app_id, store):
    # If Celery is available, use it for background processing
    if CELERY_AVAILABLE:
        if store == "playstore":
            scrape_playstore.delay(app_id, job_id)
        elif store == "appstore":
            scrape_appstore.delay(app_id, job_id)
    # Otherwise, use the existing background tasks mechanism
    pass

async def fetch_job(job_id, user_id):
    class Job:
        def __init__(self):
            self.id = job_id
            self.status = "completed"
            self.screenshots = [
                "https://example.com/screenshot1.png",
                "https://example.com/screenshot2.png"
            ]
            self.completed = True
    return Job()

async def get_screenshot_by_id(screenshot_id: int):
    # Mock screenshot data
    return {
        "id": screenshot_id,
        "job_id": 12345,
        "url": f"https://example.com/screenshot{screenshot_id}.png",
        "device_type": "iPhone 12",
        "resolution": "1170x2532",
        "file_size": 1024000,
        "created_at": datetime.now()
    }

async def get_screenshots_by_job_id(job_id: int):
    # Mock screenshots data
    return [
        {
            "id": 1,
            "job_id": job_id,
            "url": "https://example.com/screenshot1.png",
            "device_type": "iPhone 12",
            "resolution": "1170x2532",
            "file_size": 1024000,
            "created_at": datetime.now()
        },
        {
            "id": 2,
            "job_id": job_id,
            "url": "https://example.com/screenshot2.png",
            "device_type": "iPad Pro",
            "resolution": "2048x2732",
            "file_size": 2048000,
            "created_at": datetime.now()
        }
    ]

async def update_screenshot(screenshot_id: int, screenshot_data):
    # Mock update
    return await get_screenshot_by_id(screenshot_id)

async def delete_screenshot(screenshot_id: int):
    # Mock deletion
    return True

def calculate_progress(job):
    return 100.0

async def queue_scrape_job(user_id, request):
    class Job:
        def __init__(self):
            self.id = 54321
    return Job()

@router.post("/scrape", response_model=ScrapeResponse, 
         summary="Scrape app screenshots",
         description="Initiate scraping of screenshots for a mobile app from the App Store or Play Store")
async def scrape_screenshots(
    request: ScrapeRequest,
    background_tasks: BackgroundTasks,
    user = Depends(get_current_user)
):
    """
    Scrape screenshots for a mobile app
    
    - **app_id**: Package name (Play Store) or App ID (App Store)
    - **store**: 'playstore' or 'appstore'
    - **force_refresh**: Skip cache and force new scrape
    """
    # Validate quota
    if user.quota_remaining <= 0:
        raise HTTPException(status_code=403, detail="Quota exceeded")
    
    # Create job
    job = await create_scrape_job(user.id, request)
    
    # Queue background task
    background_tasks.add_task(
        execute_scrape_job,
        job.id,
        request.app_id,
        request.store
    )
    
    return {
        "job_id": job.id,
        "status": "queued",
        "estimated_time": "30-60 seconds"
    }

@router.get("/job/{job_id}", response_model=JobStatusResponse,
         summary="Get job status",
         description="Retrieve the status and results of a scraping job")
async def get_job_status(job_id: int, user = Depends(get_current_user)):
    """Get scraping job status and results"""
    job = await fetch_job(job_id, user.id)
    return {
        "job_id": job.id,
        "status": job.status,
        "screenshots": job.screenshots if job.completed else [],
        "progress": calculate_progress(job)
    }

@router.post("/batch",
          summary="Batch scrape apps",
          description="Initiate scraping for multiple apps at once (Pro/Enterprise only)")
async def batch_scrape(
    requests: List[ScrapeRequest],
    user = Depends(get_current_user)
):
    """Batch scrape multiple apps (Pro/Enterprise only)"""
    if user.tier == 'free':
        raise HTTPException(status_code=403, detail="Batch operations require Pro tier")
    
    jobs = []
    for req in requests[:50]:  # Limit 50 per batch
        job = await queue_scrape_job(user.id, req)
        jobs.append(job)
        
        # Queue background task for each request
        background_tasks = BackgroundTasks()
        background_tasks.add_task(
            execute_scrape_job,
            job.id,
            req.app_id,
            req.store
        )
    
    return {"jobs": jobs, "total": len(jobs)}

# New CRUD endpoints

@router.get("/{screenshot_id}", response_model=ScreenshotResponse,
         summary="Get screenshot by ID",
         description="Retrieve details of a specific screenshot by its ID")
async def get_screenshot(screenshot_id: int, user = Depends(get_current_user)):
    """Get a specific screenshot by ID"""
    screenshot = await get_screenshot_by_id(screenshot_id)
    if not screenshot:
        raise HTTPException(status_code=404, detail="Screenshot not found")
    return screenshot

@router.get("/job/{job_id}/screenshots", response_model=List[ScreenshotResponse],
         summary="List screenshots by job",
         description="Retrieve all screenshots associated with a specific scraping job")
async def list_screenshots_by_job(job_id: int, user = Depends(get_current_user)):
    """List all screenshots for a specific job"""
    screenshots = await get_screenshots_by_job_id(job_id)
    return screenshots

@router.put("/{screenshot_id}", response_model=ScreenshotResponse,
         summary="Update screenshot",
         description="Update metadata for a specific screenshot")
async def update_screenshot_metadata(
    screenshot_id: int,
    screenshot_data: dict,
    user = Depends(get_current_user)
):
    """Update screenshot metadata"""
    # In a real implementation, we would check if the user owns this screenshot
    updated_screenshot = await update_screenshot(screenshot_id, screenshot_data)
    if not updated_screenshot:
        raise HTTPException(status_code=404, detail="Screenshot not found")
    return updated_screenshot

@router.delete("/{screenshot_id}", status_code=status.HTTP_204_NO_CONTENT,
            summary="Delete screenshot",
            description="Delete a specific screenshot by its ID")
async def delete_screenshot_endpoint(screenshot_id: int, user = Depends(get_current_user)):
    """Delete a screenshot"""
    # In a real implementation, we would check if the user owns this screenshot
    success = await delete_screenshot(screenshot_id)
    if not success:
        raise HTTPException(status_code=404, detail="Screenshot not found")
    return