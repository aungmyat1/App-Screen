from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
from src.database.connection import get_db
from src.models.api_usage import APIUsage
from src.models.schemas import APIUsageCreate, APIUsageUpdate, APIUsageResponse

router = APIRouter(prefix="/api/v1/usage", tags=["api-usage"])


@router.get("/", response_model=List[APIUsageResponse])
async def list_api_usage(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve a list of API usage records.
    """
    usage_records = db.query(APIUsage).offset(skip).limit(limit).all()
    return usage_records


@router.get("/{usage_id}", response_model=APIUsageResponse)
async def get_api_usage(usage_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a specific API usage record by ID.
    """
    usage_record = db.query(APIUsage).filter(APIUsage.id == usage_id).first()
    if not usage_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="API usage record not found"
        )
    return usage_record


@router.post("/", response_model=APIUsageResponse, status_code=status.HTTP_201_CREATED)
async def create_api_usage(usage: APIUsageCreate, db: Session = Depends(get_db)):
    """
    Create a new API usage record.
    """
    new_usage = APIUsage(
        user_id=usage.user_id,
        endpoint=usage.endpoint,
        response_time_ms=usage.response_time_ms,
        status_code=usage.status_code
    )
    
    db.add(new_usage)
    db.commit()
    db.refresh(new_usage)
    return new_usage


@router.put("/{usage_id}", response_model=APIUsageResponse)
async def update_api_usage(usage_id: int, usage_update: APIUsageUpdate, db: Session = Depends(get_db)):
    """
    Update an existing API usage record.
    """
    db_usage = db.query(APIUsage).filter(APIUsage.id == usage_id).first()
    if not db_usage:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="API usage record not found"
        )
    
    # Update usage fields
    if usage_update.response_time_ms is not None:
        db_usage.response_time_ms = usage_update.response_time_ms
    
    if usage_update.status_code is not None:
        db_usage.status_code = usage_update.status_code
    
    db.commit()
    db.refresh(db_usage)
    return db_usage


@router.delete("/{usage_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_api_usage(usage_id: int, db: Session = Depends(get_db)):
    """
    Delete an API usage record.
    """
    db_usage = db.query(APIUsage).filter(APIUsage.id == usage_id).first()
    if not db_usage:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="API usage record not found"
        )
    
    db.delete(db_usage)
    db.commit()
    return