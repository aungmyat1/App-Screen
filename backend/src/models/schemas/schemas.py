from pydantic import BaseModel
from typing import List, Optional


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