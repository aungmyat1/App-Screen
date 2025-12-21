from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
from src.database.connection import get_db
from src.models.screenshot import Screenshot
from src.models.schemas import ScreenshotCreate, ScreenshotUpdate, ScreenshotResponse

router = APIRouter(prefix="/api/v1/screenshots-crud", tags=["screenshots-crud"])


@router.get("/", response_model=List[ScreenshotResponse])
async def list_screenshots(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve a list of screenshots.
    """
    screenshots = db.query(Screenshot).offset(skip).limit(limit).all()
    return screenshots


@router.get("/{screenshot_id}", response_model=ScreenshotResponse)
async def get_screenshot(screenshot_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a specific screenshot by ID.
    """
    screenshot = db.query(Screenshot).filter(Screenshot.id == screenshot_id).first()
    if not screenshot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Screenshot not found"
        )
    return screenshot


@router.post("/", response_model=ScreenshotResponse, status_code=status.HTTP_201_CREATED)
async def create_screenshot(screenshot: ScreenshotCreate, db: Session = Depends(get_db)):
    """
    Create a new screenshot record.
    """
    new_screenshot = Screenshot(
        job_id=screenshot.job_id,
        url=screenshot.url,
        s3_key=screenshot.s3_key,
        device_type=screenshot.device_type,
        resolution=screenshot.resolution,
        file_size=screenshot.file_size
    )
    
    db.add(new_screenshot)
    db.commit()
    db.refresh(new_screenshot)
    return new_screenshot


@router.put("/{screenshot_id}", response_model=ScreenshotResponse)
async def update_screenshot(screenshot_id: int, screenshot_update: ScreenshotUpdate, db: Session = Depends(get_db)):
    """
    Update an existing screenshot record.
    """
    db_screenshot = db.query(Screenshot).filter(Screenshot.id == screenshot_id).first()
    if not db_screenshot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Screenshot not found"
        )
    
    # Update screenshot fields
    if screenshot_update.s3_key is not None:
        db_screenshot.s3_key = screenshot_update.s3_key
    
    if screenshot_update.device_type is not None:
        db_screenshot.device_type = screenshot_update.device_type
    
    if screenshot_update.resolution is not None:
        db_screenshot.resolution = screenshot_update.resolution
    
    if screenshot_update.file_size is not None:
        db_screenshot.file_size = screenshot_update.file_size
    
    db.commit()
    db.refresh(db_screenshot)
    return db_screenshot


@router.delete("/{screenshot_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_screenshot(screenshot_id: int, db: Session = Depends(get_db)):
    """
    Delete a screenshot record.
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