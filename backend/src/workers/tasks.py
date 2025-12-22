import asyncio
import logging
import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

from backend.src.workers.celery_app import celery_app
from backend.src.core.playstore_scraper import PlayStoreScraper
from backend.src.core.appstore_scraper import AppStoreScraper

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@celery_app.task(bind=True)
def scrape_playstore(self, app_id: str, job_id: int = None):
    """
    Celery task to scrape screenshots from Play Store
    
    Args:
        app_id (str): The package name of the app
        job_id (int): The job ID for tracking purposes
        
    Returns:
        dict: Result of the scraping operation
    """
    try:
        logger.info(f"Starting Play Store scrape for app: {app_id}")
        
        # Initialize the scraper
        scraper = PlayStoreScraper()
        
        # Run the async scraping function in a new event loop
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            # Execute the scraping
            result = loop.run_until_complete(scraper.scrape(app_id))
            
            logger.info(f"Successfully scraped {len(result)} screenshots for app: {app_id}")
            
            return {
                "status": "success",
                "app_id": app_id,
                "job_id": job_id,
                "screenshots": result,
                "count": len(result)
            }
        finally:
            loop.close()
            
    except Exception as exc:
        logger.error(f"Error scraping Play Store for app {app_id}: {str(exc)}")
        self.retry(countdown=60, max_retries=3)  # Retry after 60 seconds
        return {
            "status": "error",
            "app_id": app_id,
            "job_id": job_id,
            "error": str(exc)
        }

@celery_app.task(bind=True)
def scrape_appstore(self, app_id: str, job_id: int = None):
    """
    Celery task to scrape screenshots from App Store
    
    Args:
        app_id (str): The ID of the app
        job_id (int): The job ID for tracking purposes
        
    Returns:
        dict: Result of the scraping operation
    """
    try:
        logger.info(f"Starting App Store scrape for app: {app_id}")
        
        # Initialize the scraper
        scraper = AppStoreScraper()
        
        # Run the async scraping function in a new event loop
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            # Execute the scraping
            result = loop.run_until_complete(scraper.scrape(app_id))
            
            logger.info(f"Successfully scraped {len(result)} screenshots for app: {app_id}")
            
            return {
                "status": "success",
                "app_id": app_id,
                "job_id": job_id,
                "screenshots": result,
                "count": len(result)
            }
        finally:
            loop.close()
            
    except Exception as exc:
        logger.error(f"Error scraping App Store for app {app_id}: {str(exc)}")
        self.retry(countdown=60, max_retries=3)  # Retry after 60 seconds
        return {
            "status": "error",
            "app_id": app_id,
            "job_id": job_id,
            "error": str(exc)
        }

@celery_app.task(bind=True)
def download_screenshots(self, screenshots: list, job_id: int = None):
    """
    Celery task to download screenshots
    
    Args:
        screenshots (list): List of screenshot URLs to download
        job_id (int): The job ID for tracking purposes
        
    Returns:
        dict: Result of the download operation
    """
    try:
        logger.info(f"Starting download of {len(screenshots)} screenshots for job: {job_id}")
        
        # TODO: Implement actual screenshot downloading logic
        # This would typically involve:
        # 1. Downloading images from URLs
        # 2. Uploading to cloud storage (S3, etc.)
        # 3. Saving metadata to database
        
        downloaded = []
        failed = []
        
        # Simulate downloading process
        for i, screenshot_url in enumerate(screenshots):
            try:
                # In a real implementation, you would actually download the image
                # and save it to storage
                downloaded.append({
                    "url": screenshot_url,
                    "storage_path": f"screenshots/{job_id}/{i}.png",
                    "status": "downloaded"
                })
            except Exception as e:
                failed.append({
                    "url": screenshot_url,
                    "error": str(e)
                })
        
        logger.info(f"Downloaded {len(downloaded)} screenshots, {len(failed)} failed for job: {job_id}")
        
        return {
            "status": "completed",
            "job_id": job_id,
            "downloaded": downloaded,
            "failed": failed,
            "total": len(screenshots),
            "success_count": len(downloaded),
            "failed_count": len(failed)
        }
        
    except Exception as exc:
        logger.error(f"Error downloading screenshots for job {job_id}: {str(exc)}")
        self.retry(countdown=60, max_retries=3)  # Retry after 60 seconds
        return {
            "status": "error",
            "job_id": job_id,
            "error": str(exc)
        }