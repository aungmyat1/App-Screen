from sqlalchemy.orm import Session
from typing import List, Optional
from ..models.user import User
from ..models.scrape_job import ScrapeJob
from ..models.screenshot import Screenshot
from ..models.api_usage import APIUsage

class DatabaseService:
    """
    Service class for common database operations
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    # User operations
    def get_user(self, user_id: int) -> Optional[User]:
        """Get a user by ID"""
        return self.db.query(User).filter(User.id == user_id).first()
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get a user by email"""
        return self.db.query(User).filter(User.email == email).first()
    
    def get_user_by_api_key(self, api_key: str) -> Optional[User]:
        """Get a user by API key"""
        return self.db.query(User).filter(User.api_key == api_key).first()
    
    def create_user(self, email: str, api_key: str, tier: str = "free", quota_remaining: int = 100) -> User:
        """Create a new user"""
        user = User(
            email=email,
            api_key=api_key,
            tier=tier,
            quota_remaining=quota_remaining
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def update_user_quota(self, user_id: int, quota_change: int) -> Optional[User]:
        """Update a user's quota"""
        user = self.get_user(user_id)
        if user:
            user.quota_remaining = max(0, user.quota_remaining + quota_change)
            self.db.commit()
            self.db.refresh(user)
        return user
    
    # Scrape job operations
    def get_scrape_job(self, job_id: int) -> Optional[ScrapeJob]:
        """Get a scrape job by ID"""
        return self.db.query(ScrapeJob).filter(ScrapeJob.id == job_id).first()
    
    def create_scrape_job(self, user_id: int, app_id: str, store: str) -> ScrapeJob:
        """Create a new scrape job"""
        job = ScrapeJob(
            user_id=user_id,
            app_id=app_id,
            store=store
        )
        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)
        return job
    
    def update_scrape_job_status(self, job_id: int, status: str, 
                                screenshots_count: Optional[int] = None,
                                error_message: Optional[str] = None) -> Optional[ScrapeJob]:
        """Update a scrape job's status"""
        job = self.get_scrape_job(job_id)
        if job:
            job.status = status
            if screenshots_count is not None:
                job.screenshots_count = screenshots_count
            if error_message is not None:
                job.error_message = error_message
            self.db.commit()
            self.db.refresh(job)
        return job
    
    # Screenshot operations
    def get_screenshots_by_job(self, job_id: int) -> List[Screenshot]:
        """Get all screenshots for a job"""
        return self.db.query(Screenshot).filter(Screenshot.job_id == job_id).all()
    
    def create_screenshot(self, job_id: int, url: str, s3_key: Optional[str] = None,
                         device_type: Optional[str] = None, resolution: Optional[str] = None,
                         file_size: Optional[int] = None) -> Screenshot:
        """Create a new screenshot record"""
        screenshot = Screenshot(
            job_id=job_id,
            url=url,
            s3_key=s3_key,
            device_type=device_type,
            resolution=resolution,
            file_size=file_size
        )
        self.db.add(screenshot)
        self.db.commit()
        self.db.refresh(screenshot)
        return screenshot
    
    # API usage operations
    def create_api_usage(self, user_id: int, endpoint: str, response_time_ms: int, 
                        status_code: int) -> APIUsage:
        """Record API usage"""
        usage = APIUsage(
            user_id=user_id,
            endpoint=endpoint,
            response_time_ms=response_time_ms,
            status_code=status_code
        )
        self.db.add(usage)
        self.db.commit()
        self.db.refresh(usage)
        return usage