from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


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


class BatchScrapeRequest(BaseModel):
    requests: List[ScrapeRequest]


class BatchScrapeResponse(BaseModel):
    jobs: List[dict]  # Simplified for now
    total: int


class UserBase(BaseModel):
    email: str
    tier: Optional[str] = "free"
    quota_remaining: Optional[int] = 100


class UserCreate(UserBase):
    api_key: str


class UserUpdate(BaseModel):
    email: Optional[str] = None
    api_key: Optional[str] = None
    tier: Optional[str] = None
    quota_remaining: Optional[int] = None


class UserResponse(UserBase):
    id: int
    api_key: str
    created_at: datetime

    class Config:
        from_attributes = True


class ScrapeJobBase(BaseModel):
    app_id: str
    store: str
    status: Optional[str] = "pending"


class ScrapeJobCreate(ScrapeJobBase):
    user_id: int


class ScrapeJobUpdate(BaseModel):
    status: Optional[str] = None
    screenshots_count: Optional[int] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None


class ScrapeJobResponse(ScrapeJobBase):
    id: int
    user_id: int
    screenshots_count: int
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ScreenshotBase(BaseModel):
    url: str
    device_type: Optional[str] = None
    resolution: Optional[str] = None
    file_size: Optional[int] = None


class ScreenshotCreate(ScreenshotBase):
    job_id: int
    s3_key: Optional[str] = None


class ScreenshotUpdate(BaseModel):
    s3_key: Optional[str] = None
    device_type: Optional[str] = None
    resolution: Optional[str] = None
    file_size: Optional[int] = None


class ScreenshotResponse(ScreenshotBase):
    id: int
    job_id: int
    s3_key: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class APIUsageBase(BaseModel):
    endpoint: str
    response_time_ms: int
    status_code: int


class APIUsageCreate(APIUsageBase):
    user_id: int


class APIUsageUpdate(BaseModel):
    response_time_ms: Optional[int] = None
    status_code: Optional[int] = None


class APIUsageResponse(APIUsageBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True