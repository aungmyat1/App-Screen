from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
from src.database.connection import get_db
from src.models.scrape_job import ScrapeJob
from src.models.schemas import ScrapeJobCreate, ScrapeJobUpdate, ScrapeJobResponse

router = APIRouter(prefix="/api/v1/jobs", tags=["scrape-jobs"])


@router.get("/", response_model=List[ScrapeJobResponse])
async def list_scrape_jobs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve a list of scrape jobs.
    """
    jobs = db.query(ScrapeJob).offset(skip).limit(limit).all()
    return jobs


@router.get("/{job_id}", response_model=ScrapeJobResponse)
async def get_scrape_job(job_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a specific scrape job by ID.
    """
    job = db.query(ScrapeJob).filter(ScrapeJob.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scrape job not found"
        )
    return job


@router.post("/", response_model=ScrapeJobResponse, status_code=status.HTTP_201_CREATED)
async def create_scrape_job(job: ScrapeJobCreate, db: Session = Depends(get_db)):
    """
    Create a new scrape job.
    """
    new_job = ScrapeJob(
        user_id=job.user_id,
        app_id=job.app_id,
        store=job.store,
        status=job.status
    )
    
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job


@router.put("/{job_id}", response_model=ScrapeJobResponse)
async def update_scrape_job(job_id: int, job_update: ScrapeJobUpdate, db: Session = Depends(get_db)):
    """
    Update an existing scrape job.
    """
    db_job = db.query(ScrapeJob).filter(ScrapeJob.id == job_id).first()
    if not db_job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scrape job not found"
        )
    
    # Update job fields
    if job_update.status is not None:
        db_job.status = job_update.status
    
    if job_update.screenshots_count is not None:
        db_job.screenshots_count = job_update.screenshots_count
    
    if job_update.started_at is not None:
        db_job.started_at = job_update.started_at
    
    if job_update.completed_at is not None:
        db_job.completed_at = job_update.completed_at
    
    if job_update.error_message is not None:
        db_job.error_message = job_update.error_message
    
    db.commit()
    db.refresh(db_job)
    return db_job


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_scrape_job(job_id: int, db: Session = Depends(get_db)):
    """
    Delete a scrape job.
    """
    db_job = db.query(ScrapeJob).filter(ScrapeJob.id == job_id).first()
    if not db_job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scrape job not found"
        )
    
    db.delete(db_job)
    db.commit()
    return