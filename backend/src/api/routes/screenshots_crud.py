from fastapi import APIRouter, Depends, HTTPException, status, Request
from typing import List
from sqlalchemy.orm import Session
from src.database.connection import get_db
from src.models.screenshot import Screenshot
from src.models.schemas import ScreenshotCreate, ScreenshotUpdate, ScreenshotResponse
from src.api.middleware.rate_limit import limiter

router = APIRouter(prefix="/api/v1/screenshots-crud", tags=["screenshots-crud"])


@router.get("/", response_model=List[ScreenshotResponse])
@limiter.limit("100/hour")
async def list_screenshots(request: Request, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve a list of screenshots.
    Rate limited to 100 requests per hour.
    """
    screenshots = db.query(Screenshot).offset(skip).limit(limit).all()
    return screenshots


@router.get("/{screenshot_id}", response_model=ScreenshotResponse)
@limiter.limit("1000/hour")
async def get_screenshot(request: Request, screenshot_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a specific screenshot by ID.
    Rate limited to 1000 requests per hour.
    """
    screenshot = db.query(Screenshot).filter(Screenshot.id == screenshot_id).first()
    if not screenshot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Screenshot not found"
        )
    return screenshot


@router.post("/", response_model=ScreenshotResponse)
@limiter.limit("50/hour")
async def create_screenshot(request: Request, screenshot: ScreenshotCreate, db: Session = Depends(get_db)):
    """
    Create a new screenshot.
    Rate limited to 50 requests per hour.
    """
    db_screenshot = Screenshot(**screenshot.dict())
    db.add(db_screenshot)
    db.commit()
    db.refresh(db_screenshot)
    return db_screenshot


@router.put("/{screenshot_id}", response_model=ScreenshotResponse)
@limiter.limit("100/hour")
async def update_screenshot(request: Request, screenshot_id: int, screenshot: ScreenshotUpdate, db: Session = Depends(get_db)):
    """
    Update an existing screenshot.
    Rate limited to 100 requests per hour.
    """
    db_screenshot = db.query(Screenshot).filter(Screenshot.id == screenshot_id).first()
    if not db_screenshot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Screenshot not found"
        )
    
    for key, value in screenshot.dict(exclude_unset=True).items():
        setattr(db_screenshot, key, value)
    
    db.commit()
    db.refresh(db_screenshot)
    return db_screenshot


@router.delete("/{screenshot_id}", status_code=status.HTTP_204_NO_CONTENT)
@limiter.limit("50/hour")
async def delete_screenshot(request: Request, screenshot_id: int, db: Session = Depends(get_db)):
    """
    Delete a screenshot.
    Rate limited to 50 requests per hour.
    """
    db_screenshot = db.query(Screenshot).filter(Screenshot.id == screenshot_id).first()
    if not db_screenshot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Screenshot not found"
        )
    
    db.delete(db_screenshot)
    db.commit()
    return