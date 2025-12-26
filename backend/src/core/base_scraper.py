from abc import ABC, abstractmethod
import os

# Check if Playwright is available
try:
    from playwright.async_api import async_playwright
    PLAYWRIGHT_AVAILABLE = True
except ImportError:
    PLAYWRIGHT_AVAILABLE = False

class BaseScraper(ABC):
    """
    Abstract base class for all scrapers.
    Defines the common interface for scraping app store screenshots.
    """
    
    def __init__(self, headless: bool = True):
        self.headless = headless
        self.playwright_available = PLAYWRIGHT_AVAILABLE
    
    @abstractmethod
    async def scrape_screenshots(self, app_id: str, **kwargs):
        """
        Scrape screenshots for the given app ID.
        
        Args:
            app_id (str): The ID of the app to scrape
            
        Returns:
            list: List of screenshot URLs or file paths
        """
        if not self.playwright_available:
            # In development without Playwright, return mock data
            if os.getenv("ENVIRONMENT") == "development":
                return [
                    f"https://example.com/mock/{app_id}/screenshot1.png",
                    f"https://example.com/mock/{app_id}/screenshot2.png"
                ]
            else:
                raise RuntimeError("Playwright is not available")
        pass
    
    @abstractmethod
    def validate_app_id(self, app_id: str) -> bool:
        """
        Validate the app ID format for this scraper.
        
        Args:
            app_id (str): The app ID to validate
            
        Returns:
            bool: True if valid, False otherwise
        """
        pass