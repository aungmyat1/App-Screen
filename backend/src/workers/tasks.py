import asyncio
import logging
import sys
import os
import random
from datetime import datetime, timedelta
from typing import List, Dict

# Add the backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

from backend.src.workers.celery_app import celery_app
from backend.src.core.playstore_scraper import PlayStoreScraper
from backend.src.core.appstore_scraper import AppStoreScraper
from backend.src.core.storage import S3Storage
from backend.src.core.image_processor import ImageProcessor

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@celery_app.task(bind=True, max_retries=3)
def scrape_playstore(self, job_id: int, app_id: str):
    """Celery task for Play Store scraping"""
    try:
        # Since PlayStoreScraper is async, we need to run it in an event loop
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            scraper = PlayStoreScraper()
            # Execute the async scraping function
            screenshots, metadata = loop.run_until_complete(scraper.scrape_screenshots(app_id))
        finally:
            loop.close()
        
        # Save to database (async function needs to run in event loop)
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            loop.run_until_complete(save_screenshots(job_id, screenshots, metadata))
        finally:
            loop.close()
        
        # Process and upload to S3 (async function needs to run in event loop)
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            loop.run_until_complete(process_and_upload_screenshots(screenshots))
        finally:
            loop.close()
        
        # Update job status (async function needs to run in event loop)
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            loop.run_until_complete(update_job_status(job_id, 'completed'))
        finally:
            loop.close()
        
        return {
            'job_id': job_id,
            'screenshots_count': len(screenshots)
        }
        
    except Exception as e:
        # Calculate exponential backoff delay with jitter
        countdown = 60 * (2 ** self.request.retries) + random.uniform(0, 10)
        
        # Update job status (async function needs to run in event loop)
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            loop.run_until_complete(update_job_status(job_id, 'failed', str(e)))
        finally:
            loop.close()
            
        raise self.retry(exc=e, countdown=countdown, max_retries=3)

@celery_app.task(bind=True, max_retries=3)
def scrape_appstore(self, job_id: int, app_id: str):
    """Celery task for App Store scraping"""
    try:
        # Since AppStoreScraper is async, we need to run it in an event loop
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            scraper = AppStoreScraper()
            # Execute the async scraping function
            screenshots, metadata = loop.run_until_complete(scraper.scrape_screenshots(app_id))
        finally:
            loop.close()
        
        # Save to database (async function needs to run in event loop)
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            loop.run_until_complete(save_screenshots(job_id, screenshots, metadata))
        finally:
            loop.close()
        
        # Process and upload to S3 (async function needs to run in event loop)
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            loop.run_until_complete(process_and_upload_screenshots(screenshots))
        finally:
            loop.close()
        
        # Update job status (async function needs to run in event loop)
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            loop.run_until_complete(update_job_status(job_id, 'completed'))
        finally:
            loop.close()
        
        return {
            'job_id': job_id,
            'screenshots_count': len(screenshots)
        }
        
    except Exception as e:
        # Calculate exponential backoff delay with jitter
        countdown = 60 * (2 ** self.request.retries) + random.uniform(0, 10)
        
        # Update job status (async function needs to run in event loop)
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            loop.run_until_complete(update_job_status(job_id, 'failed', str(e)))
        finally:
            loop.close()
            
        raise self.retry(exc=e, countdown=countdown, max_retries=3)

@celery_app.task
def cleanup_old_screenshots():
    """Periodic task to clean up old cached screenshots"""
    # Delete screenshots older than 30 days
    cutoff = datetime.utcnow() - timedelta(days=30)
    
    # Delete old files (async function needs to run in event loop)
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        loop.run_until_complete(delete_old_files(cutoff))
    finally:
        loop.close()

# Functions for the functionality that would need to be implemented
async def save_screenshots(job_id: int, screenshots: list, metadata: dict):
    """Save screenshots to database"""
    # Implementation would go here
    pass

async def process_and_upload_screenshots(screenshots: List[Dict]):
    """Process and upload screenshots to S3"""
    # Check if watermarking is enabled via environment variable
    watermark_text = os.getenv('WATERMARK_TEXT')
    image_processor = ImageProcessor(watermark_text=watermark_text)
    s3_storage = S3Storage()
    
    # Implementation would go here
    pass

async def update_job_status(job_id: int, status: str, error_message: str = None):
    """Update job status in database"""
    # Implementation would go here
    pass

async def delete_old_files(cutoff: datetime):
    """Delete old screenshot files"""
    # Implementation would go here
    pass